import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Ban, 
  Globe, 
  Activity, 
  AlertTriangle, 
  Eye,
  Filter,
  Download,
  Clock,
  TrendingUp
} from 'lucide-react';

interface FraudStats {
  totalClicks: number;
  fraudulentClicks: number;
  blockedIps: number;
  topFraudReasons: Array<{ reason: string; count: number }>;
  clicksByCountry: Array<{ country: string; clicks: number; fraudulent: number }>;
  recentActivity: {
    fraudulentClicksLastHour: number;
    newBlockedIpsLastHour: number;
  };
}

interface BlockedIp {
  id: number;
  ipAddress: string;
  reason: string;
  riskScore: number;
  isVpn: boolean;
  isProxy: boolean;
  country: string;
  city: string;
  clickCount: number;
  blockedAt: string;
  isActive: boolean;
}

interface ClickEvent {
  id: number;
  appId: string;
  ipAddress: string;
  userAgent: string;
  country: string;
  city: string;
  isVpn: boolean;
  isProxy: boolean;
  isBot: boolean;
  riskScore: number;
  clickTimestamp: string;
  isFraudulent: boolean;
  fraudReason: string;
}

export default function FraudProtectionDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [ipFilter, setIpFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  const { data: fraudStats, isLoading: statsLoading } = useQuery<{ success: boolean; data: FraudStats }>({
    queryKey: ['/api/fraud-protection/stats', selectedTimeRange],
    queryFn: async () => {
      const response = await fetch(`/api/fraud-protection/stats?timeRange=${selectedTimeRange}`);
      return response.json();
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: blockedIps, isLoading: blockedIpsLoading } = useQuery<{ success: boolean; data: BlockedIp[] }>({
    queryKey: ['/api/fraud-protection/blocked-ips'],
    queryFn: async () => {
      const response = await fetch('/api/fraud-protection/blocked-ips');
      return response.json();
    },
    refetchInterval: 30000
  });

  const { data: recentClicks, isLoading: clicksLoading } = useQuery<{ success: boolean; data: ClickEvent[] }>({
    queryKey: ['/api/fraud-protection/recent-clicks', ipFilter, countryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (ipFilter) params.append('ip', ipFilter);
      if (countryFilter) params.append('country', countryFilter);
      
      const response = await fetch(`/api/fraud-protection/recent-clicks?${params}`);
      return response.json();
    },
    refetchInterval: 30000
  });

  const handleUnblockIp = async (ipAddress: string) => {
    try {
      await fetch(`/api/fraud-protection/unblock-ip/${ipAddress}`, {
        method: 'POST'
      });
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error unblocking IP:', error);
    }
  };

  const handleBlockIp = async (ipAddress: string, reason: string) => {
    try {
      await fetch('/api/fraud-protection/block-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ipAddress,
          reason,
          riskScore: 100,
          isVpn: false,
          isProxy: false,
          country: '',
          city: '',
          userAgent: 'Manual block',
          isActive: true
        })
      });
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error blocking IP:', error);
    }
  };

  const exportData = () => {
    const csvData = blockedIps?.data?.map(ip => ({
      IP: ip.ipAddress,
      Country: ip.country,
      City: ip.city,
      Reason: ip.reason,
      RiskScore: ip.riskScore,
      VPN: ip.isVpn ? 'Yes' : 'No',
      Proxy: ip.isProxy ? 'Yes' : 'No',
      BlockedAt: ip.blockedAt,
      ClickCount: ip.clickCount
    })) || [];

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blocked-ips-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (statsLoading || blockedIpsLoading || clicksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = fraudStats?.data;
  const blocked = blockedIps?.data || [];
  const clicks = recentClicks?.data || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fraud Protection Dashboard</h1>
          <p className="text-gray-600">Monitor and manage click fraud protection</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClicks?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.recentActivity?.fraudulentClicksLastHour || 0} in last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraudulent Clicks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.fraudulentClicks?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalClicks ? 
                ((stats.fraudulentClicks / stats.totalClicks) * 100).toFixed(1) + '% of total'
                : '0% of total'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
            <Ban className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.blockedIps?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.recentActivity?.newBlockedIpsLastHour || 0} new in last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protection Rate</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.totalClicks ? 
                (((stats.totalClicks - stats.fraudulentClicks) / stats.totalClicks) * 100).toFixed(1) + '%'
                : '100%'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Legitimate traffic protected
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="blocked-ips">Blocked IPs</TabsTrigger>
          <TabsTrigger value="recent-clicks">Recent Clicks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Fraud Reasons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats?.topFraudReasons?.map((reason, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{reason.reason}</span>
                      <Badge variant="outline">{reason.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clicks by Country</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats?.clicksByCountry?.slice(0, 8).map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{country.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{country.clicks}</Badge>
                        {country.fraudulent > 0 && (
                          <Badge variant="destructive">{country.fraudulent}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blocked-ips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blocked IP Addresses</CardTitle>
              <div className="flex gap-2">
                <Input
                  placeholder="Filter by IP address..."
                  value={ipFilter}
                  onChange={(e) => setIpFilter(e.target.value)}
                  className="w-64"
                />
                <Input
                  placeholder="Filter by country..."
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="w-64"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {blocked.map((ip) => (
                  <div key={ip.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Ban className="w-5 h-5 text-red-500" />
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {ip.ipAddress}
                        </code>
                      </div>
                      <div className="flex gap-2">
                        {ip.isVpn && <Badge variant="secondary">VPN</Badge>}
                        {ip.isProxy && <Badge variant="secondary">Proxy</Badge>}
                        <Badge variant="outline">{ip.country}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Risk Score: {ip.riskScore}/100
                        </div>
                        <div className="text-xs text-gray-500">
                          {ip.clickCount} clicks • {new Date(ip.blockedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUnblockIp(ip.ipAddress)}
                      >
                        Unblock
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent-clicks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Click Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clicks.map((click) => (
                  <div key={click.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {click.isFraudulent ? (
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        ) : (
                          <Eye className="w-5 h-5 text-green-500" />
                        )}
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {click.ipAddress}
                        </code>
                      </div>
                      <div className="flex gap-2">
                        {click.isVpn && <Badge variant="secondary">VPN</Badge>}
                        {click.isProxy && <Badge variant="secondary">Proxy</Badge>}
                        {click.isBot && <Badge variant="destructive">Bot</Badge>}
                        <Badge variant="outline">{click.country}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Risk Score: {click.riskScore}/100
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(click.clickTimestamp).toLocaleString()}
                        </div>
                      </div>
                      {!click.isFraudulent && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleBlockIp(click.ipAddress, 'Manual block')}
                        >
                          Block
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              Advanced analytics and reporting features coming soon. Current basic protection is active.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}