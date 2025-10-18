
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials as initialTestimonials } from "@/lib/data";
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Define the shape of a testimonial item including its position and rotation
type TestimonialItem = (typeof initialTestimonials)[0] & {
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
};

// Define the state for the component that is being dragged
type DragState = {
  id: number;
  offsetX: number;
  offsetY: number;
} | null;

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [dragState, setDragState] = useState<DragState>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // This effect runs only once on the client to set the initial random positions
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const boardWidth = board.offsetWidth;
    const boardHeight = board.offsetHeight;

    setTestimonials(
      initialTestimonials.map((testimonial, index) => {
        // Generate random positions within the board, leaving some margin
        const x = Math.random() * (boardWidth - 300); 
        const y = Math.random() * (boardHeight - 225);
        const rotation = Math.random() * 20 - 10; // Random rotation between -10 and 10 degrees
        return {
          ...testimonial,
          x,
          y,
          rotation,
          zIndex: index + 1,
        };
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    // Prevent default drag behavior to avoid conflicts
    if (e.button !== 0) return; // Only allow left-clicks
    e.preventDefault();
    
    const testimonial = testimonials.find(t => t.id === id);
    if (!testimonial) return;

    // Bring the clicked card to the front
    const maxZIndex = Math.max(...testimonials.map(t => t.zIndex));
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, zIndex: maxZIndex + 1 } : t));

    // Prepare for dragging
    setDragState({
      id: id,
      offsetX: e.clientX - testimonial.x,
      offsetY: e.clientY - testimonial.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragState || !boardRef.current) return;
    
    const boardRect = boardRef.current.getBoundingClientRect();
    let newX = e.clientX - dragState.offsetX;
    let newY = e.clientY - dragState.offsetY;

    // Constrain movement within the board
    newX = Math.max(0, Math.min(newX, boardRect.width - 300)); // Assuming card width is 300px
    newY = Math.max(0, Math.min(newY, boardRect.height - 225)); // Assuming card height is 225px


    setTestimonials(testimonials.map(t => 
      t.id === dragState.id ? { ...t, x: newX, y: newY } : t
    ));
  };

  const handleMouseUp = () => {
    setDragState(null);
  };
  
  const handleMouseLeave = () => {
    setDragState(null);
  };
  
  const handleDoubleClick = (imageUrl: string) => {
    setZoomedImage(imageUrl);
  };


  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
            <h2 className="text-3xl font-headline font-bold">What My Clients Say</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Authentic feedback from people who have transformed their work and life with my help. (Click and drag the notes!)
            </p>
          </div>
        </div>
        
        <div 
            ref={boardRef}
            className="relative w-full h-[600px] mt-12 cursor-grab active:cursor-grabbing"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            {testimonials.map((testimonial) => (
                <div
                    key={testimonial.id}
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                        left: `${testimonial.x}px`,
                        top: `${testimonial.y}px`,
                        transform: `rotate(${testimonial.rotation}deg)`,
                        zIndex: testimonial.zIndex,
                        userSelect: 'none',
                    }}
                    onMouseDown={(e) => handleMouseDown(e, testimonial.id)}
                    onDoubleClick={() => handleDoubleClick(testimonial.image.imageUrl)}
                >
                    <Card className={cn(
                        "overflow-hidden shadow-2xl w-[300px] aspect-4/3",
                        "transform transition-transform duration-300",
                        dragState?.id === testimonial.id ? 'scale-105 shadow-primary/40' : 'hover:scale-105'
                    )}>
                      <CardContent className="p-0">
                        <Image
                          src={testimonial.image.imageUrl}
                          alt={`Testimonial from ${testimonial.name}`}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover pointer-events-none"
                          data-ai-hint={testimonial.image.imageHint}
                          priority={true}
                        />
                      </CardContent>
                    </Card>
                </div>
            ))}
        </div>
      </div>
      
      <Dialog open={!!zoomedImage} onOpenChange={(isOpen) => !isOpen && setZoomedImage(null)}>
        <DialogContent className="p-0 border-0 max-w-4xl bg-transparent shadow-none">
            {zoomedImage && (
                <Image
                    src={zoomedImage}
                    alt="Zoomed testimonial"
                    width={1600}
                    height={1200}
                    className="w-full h-auto object-contain rounded-lg"
                />
            )}
        </DialogContent>
      </Dialog>

    </section>
  );
};

export default Testimonials;

    