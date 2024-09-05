import Image from "next/image";
import React from "react";

function ImageGallery() {
  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="order-last flex gap-4 lg:order-none lg:flex-col">
          <div className="overflow-hidden rounded-lg bg-gray-100">
            <Image
              src="https://images.unsplash.com/photo-1523381140794-a1eef18a37c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MjQ2fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
              width={200}
              height={200}
              alt="product image"
              className="h-full w-full object-cover object-center cursor-pointer"
            />
          </div>

          <div className="overflow-hidden rounded-lg bg-gray-100">
            <Image
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              width={200}
              height={200}
              alt="product image"
              className="h-full w-full object-cover object-center cursor-pointer"
            />
          </div>

          <div className="overflow-hidden rounded-lg bg-gray-100">
            <Image
              src="https://images.unsplash.com/photo-1523381140794-a1eef18a37c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MjQ2fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
              width={200}
              height={200}
              alt="product image"
              className="h-full w-full object-cover object-center cursor-pointer"
            />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg bg-gray-100 lg:col-span-4">
          <Image
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
