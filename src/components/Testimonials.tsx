import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      location: "London",
      text: "The world's most advanced platform. Got my results in 24 hours with insights from top specialists.",
      rating: 5
    },
    {
      name: "Dr. James K.",
      location: "Manchester", 
      text: "Exceptional global platform for my practice. Seamless patient management and world-class technology.",
      rating: 5
    },
    {
      name: "Michael R.",
      location: "Birmingham",
      text: "Revolutionary home service. The most professional health experience I've ever had.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-playfair font-normal text-primary mb-4">
            Trusted by Millions Worldwide
          </h2>
          <p className="text-xl text-muted-foreground">
            Join the global community revolutionizing health
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card p-8 rounded-sm shadow-card hover:shadow-accent transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-sm flex items-center justify-center mr-4">
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-primary fill-current" />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-playfair font-medium text-lg">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground font-inter">{testimonial.location}</p>
                </div>
              </div>
              <p className="text-muted-foreground font-inter leading-relaxed">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;