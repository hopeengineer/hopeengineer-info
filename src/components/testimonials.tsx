import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { testimonials } from "@/lib/data";

const Testimonials = () => {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">What My Clients Say</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Authentic feedback from people who have transformed their work and life with my help.
            </p>
          </div>
        </div>
        <div className="py-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
                      <CardContent className="flex aspect-[4/3] items-center justify-center p-0">
                        <Image
                          src={testimonial.image.imageUrl}
                          alt={`Testimonial from ${testimonial.name}`}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover"
                          data-ai-hint={testimonial.image.imageHint}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
