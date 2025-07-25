import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Clock, Shield, CreditCard, FileText, Phone } from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      title: "Blood Tests & Testing",
      icon: <FileText className="w-5 h-5" />,
      items: [
        {
          question: "How accurate are your blood tests?",
          answer: "Our blood tests are processed by UKAS accredited laboratories with 99.9% accuracy. All tests are reviewed by qualified healthcare professionals to ensure reliable results."
        },
        {
          question: "Do I need to fast before my blood test?",
          answer: "This depends on the specific tests ordered. Fasting tests (like glucose or cholesterol) require 8-12 hours of fasting. Non-fasting tests can be taken at any time. We'll provide specific instructions when you book."
        },
        {
          question: "How long do results take?",
          answer: "Most results are available from 3 working days. Complex tests may take up to 7 working days. Urgent tests can be processed faster - please contact us for expedited options."
        },
        {
          question: "What if my results are abnormal?",
          answer: "If your results are outside normal ranges, we'll flag this immediately. You'll receive guidance on next steps, which may include follow-up testing or referral to a specialist through our platform."
        }
      ]
    },
    {
      title: "Booking & Appointments",
      icon: <Clock className="w-5 h-5" />,
      items: [
        {
          question: "How do I book an appointment?",
          answer: "You can book online through our platform, selecting your preferred test, clinic location, and appointment time. Same-day and next-day appointments are often available."
        },
        {
          question: "Can I change or cancel my appointment?",
          answer: "Yes, you can modify or cancel your appointment up to 2 hours before your scheduled time through your online account or by calling our support team."
        },
        {
          question: "Do you offer home visits?",
          answer: "Yes, we offer home blood collection services in most areas. This service includes a qualified phlebotomist visiting your home at a convenient time."
        },
        {
          question: "What should I bring to my appointment?",
          answer: "Please bring a valid photo ID and your booking confirmation. If you're having fasting tests, ensure you've followed the fasting instructions provided."
        }
      ]
    },
    {
      title: "Privacy & Security",
      icon: <Shield className="w-5 h-5" />,
      items: [
        {
          question: "How is my data protected?",
          answer: "We're fully GDPR compliant and use bank-level encryption to protect your data. Your health information is stored securely and only shared with authorised healthcare professionals involved in your care."
        },
        {
          question: "Who can see my results?",
          answer: "Only you and healthcare professionals directly involved in your care can access your results. We never share your data with third parties without your explicit consent."
        },
        {
          question: "How long do you keep my records?",
          answer: "We retain your health records for 8 years as required by UK healthcare regulations. You can request deletion of your data at any time, subject to legal retention requirements."
        }
      ]
    },
    {
      title: "Payments & Pricing",
      icon: <CreditCard className="w-5 h-5" />,
      items: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit and debit cards, PayPal, and bank transfers. Payment is required at the time of booking to secure your appointment."
        },
        {
          question: "Do you accept insurance?",
          answer: "We work with most private health insurance providers. Please check with your insurer about coverage and provide your policy details when booking."
        },
        {
          question: "Are there any hidden fees?",
          answer: "No, our pricing is transparent. The price you see includes the test, clinic fees, and results delivery. Home visits and expedited processing may incur additional charges."
        },
        {
          question: "Can I get a refund?",
          answer: "Refunds are available for cancellations made more than 24 hours before your appointment. Same-day cancellations may incur a cancellation fee."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our blood testing services, booking process, and healthcare platform.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {category.icon}
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`item-${categoryIndex}-${itemIndex}`}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Support */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                Still Need Help?
              </CardTitle>
              <CardDescription>
                Can't find the answer you're looking for? Our support team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Phone Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Call us on <span className="font-medium">0800 123 4567</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Monday - Friday: 8:00 AM - 6:00 PM
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Email Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Email us at <span className="font-medium">help@nuvivohealth.co.uk</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    We typically respond within 2 hours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;