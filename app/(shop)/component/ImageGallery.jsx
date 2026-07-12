"use client";
import Image from "next/image";
import React, { useState } from "react";

function ImageGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(images[0].image);
  return (
    <div>
      <div className="grid gap-3 lg:grid-cols-5">
        {/* Sidebar thumbnails */}
        <div className="order-last flex gap-3 lg:order-none lg:flex-col">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img.image)}
              className={`overflow-hidden border bg-surface2 transition ${
                img.image === selectedImage
                  ? "border-primary"
                  : "border-line hover:border-white"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={img.image}
                width={200}
                height={200}
                alt={`product image ${index + 1}`}
                className="h-[90px] w-[90px] cursor-pointer object-cover object-center md:h-[130px] md:w-full"
              />
            </button>
          ))}
        </div>
        <div className="relative overflow-hidden border border-line bg-surface2 lg:col-span-4">
          <Image
            src={selectedImage}
            width={600}
            height={600}
            alt="product image"
            className="h-[400px] w-full object-cover object-center md:h-[640px]"
          />
        </div>
      </div>
    </div>
  );
}

export default ImageGallery;
