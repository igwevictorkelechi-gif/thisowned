"use client";
import Image from "next/image";
import React, { useState } from "react";

function ImageGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(images[0].image);
  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Sidebar thumbnails */}
        <div className="order-last flex gap-5 lg:order-none lg:flex-col">
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(img.image)}
              className="overflow-hidden rounded-lg bg-gray-100"
            >
              <Image
                src={img.image}
                width={200}
                height={200}
                alt={`product image ${index + 1}`}
                className="h-full w-full object-cover object-center cursor-pointer"
              />
            </div>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-lg bg-gray-100 lg:col-span-4">
          <Image
            src={selectedImage}
            width={500}
            height={500}
            alt="product image"
            className="h-full w-full object-cover object-center"
          />
          <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
            Sale
          </span>
        </div>
      </div>
    </div>
  );
}

export default ImageGallery;
