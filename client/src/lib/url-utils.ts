/**
 * URL parameter preservation utilities for affiliate links
 */

/**
 * Preserves URL parameters from one URL to another
 * This is useful for maintaining tracking parameters across redirects
 * 
 * @param sourceUrl - The original URL with parameters to preserve
 * @param targetUrl - The target URL where parameters should be added
 * @param overrideParams - Parameters that should override existing ones in the target URL
 * @returns The target URL with preserved parameters
 */
export function preserveUrlParameters(
  sourceUrl: string,
  targetUrl: string,
  overrideParams: boolean = true
): string {
  try {
    // Parse the source and target URLs
    const sourceUrlObj = new URL(sourceUrl);
    const targetUrlObj = new URL(targetUrl);
    
    // Get all parameters from the source URL
    const sourceParams = new URLSearchParams(sourceUrlObj.search);
    
    // Iterate over all source parameters and add them to the target URL
    sourceParams.forEach((value, key) => {
      // Skip empty values
      if (!value) return;
      
      // If override is true or the parameter doesn't exist in target, add it
      if (overrideParams || !targetUrlObj.searchParams.has(key)) {
        targetUrlObj.searchParams.set(key, value);
      }
    });
    
    return targetUrlObj.toString();
  } catch (error) {
    console.error('Error preserving URL parameters:', error);
    // Return the original target URL if something goes wrong
    return targetUrl;
  }
}

/**
 * Adds UTM tracking parameters to a URL
 * 
 * @param url - The URL to add tracking parameters to
 * @param source - UTM source parameter
 * @param medium - UTM medium parameter
 * @param campaign - UTM campaign parameter
 * @param content - UTM content parameter (optional)
 * @param term - UTM term parameter (optional)
 * @returns The URL with UTM parameters added
 */
export function addUtmParameters(
  url: string,
  source: string,
  medium: string,
  campaign: string,
  content?: string,
  term?: string
): string {
  try {
    const urlObj = new URL(url);
    
    // Add the required UTM parameters
    urlObj.searchParams.set('utm_source', source);
    urlObj.searchParams.set('utm_medium', medium);
    urlObj.searchParams.set('utm_campaign', campaign);
    
    // Add optional UTM parameters if provided
    if (content) urlObj.searchParams.set('utm_content', content);
    if (term) urlObj.searchParams.set('utm_term', term);
    
    return urlObj.toString();
  } catch (error) {
    console.error('Error adding UTM parameters:', error);
    // Return the original URL if something goes wrong
    return url;
  }
}

/**
 * Process an affiliate link URL by adding site-specific parameters
 * Different affiliate programs require different parameter formats
 * 
 * @param url - The affiliate URL to process
 * @param appId - The ID of the app
 * @param affiliateId - The ID of the affiliate link
 * @returns The processed URL with all necessary parameters
 */
export function processAffiliateUrl(
  url: string,
  appId: string,
  affiliateId: number
): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Add tracking parameters specific to the TopApps site
    urlObj.searchParams.set('ref', 'topapps');
    urlObj.searchParams.set('app_id', appId);
    urlObj.searchParams.set('link_id', affiliateId.toString());
    
    // Add specific parameters based on the affiliate program domain
    if (hostname.includes('amazon')) {
      // Amazon affiliate links
      if (!urlObj.searchParams.has('tag')) {
        // Only set tag if not already set in the original URL
        urlObj.searchParams.set('tag', 'topapps-20');
      }
    } else if (hostname.includes('ebay')) {
      // eBay affiliate links
      urlObj.searchParams.set('mkevt', '1');
      urlObj.searchParams.set('mkcid', '1');
      urlObj.searchParams.set('mkrid', 'topapps' + affiliateId);
    } else if (hostname.includes('walmart')) {
      // Walmart affiliate links
      urlObj.searchParams.set('wpa_ref', 'topapps');
    } else if (hostname.includes('bestbuy')) {
      // Best Buy affiliate links
      urlObj.searchParams.set('ref', 'topapps');
    }
    
    // Add UTM parameters for general tracking
    return addUtmParameters(
      urlObj.toString(),
      'topapps',
      'affiliate',
      appId,
      `link-${affiliateId}`
    );
  } catch (error) {
    console.error('Error processing affiliate URL:', error);
    // Return the original URL if something goes wrong
    return url;
  }
}