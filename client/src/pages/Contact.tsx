import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(500, "Message cannot exceed 500 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    // In a real implementation, this would send the form data to the server
    console.log("Contact form submitted:", data);
    
    toast({
      title: "Message sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
      variant: "default",
    });
    
    form.reset();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      
      <div className="mb-8">
        <p className="text-gray-600">
          Have questions, suggestions, or feedback? Fill out the form below to get in touch with our team.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="What is this regarding?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Your message here..." 
                    className="min-h-[150px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Maximum 500 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full md:w-auto">
            Send Message
          </Button>
        </form>
      </Form>
      
      <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-bold mb-4">Other Ways to Reach Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-2">
              <i className="fas fa-envelope text-primary mr-2"></i>
              <h3 className="font-semibold">Email</h3>
            </div>
            <p className="text-gray-600">contact@topapps.store</p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <i className="fas fa-map-marker-alt text-primary mr-2"></i>
              <h3 className="font-semibold">Address</h3>
            </div>
            <p className="text-gray-600">
              123 App Street<br />
              Digital City, DC 10101
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <i className="fas fa-phone text-primary mr-2"></i>
              <h3 className="font-semibold">Phone</h3>
            </div>
            <p className="text-gray-600">+1 (555) 123-4567</p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <i className="fas fa-clock text-primary mr-2"></i>
              <h3 className="font-semibold">Business Hours</h3>
            </div>
            <p className="text-gray-600">
              Monday - Friday: 9:00 AM - 5:00 PM<br />
              Weekend: Closed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
