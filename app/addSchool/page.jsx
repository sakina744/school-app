'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [success, setSuccess] = useState('');

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      for (let key in data) {
        if (key === 'image') {
          formData.append(key, data[key][0]); // use first file
        } else {
          formData.append(key, data[key]);
        }
      }

      const res = await axios.post('/api/school', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(res.data.message);
      reset();
    } catch (err) {
      console.error(err);
      setSuccess(err.response?.data?.error || 'Failed to add school.');
    }
  }; // <-- only this closing brace ends onSubmit

  // The component return starts here, outside onSubmit
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add School</h1>
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 max-w-md">
        <input {...register('name', { required: true })} placeholder="School Name" className="border p-2 rounded" />
        {errors.name && <span className="text-red-500">Name is required</span>}

        <input {...register('address', { required: true })} placeholder="Address" className="border p-2 rounded" />
        {errors.address && <span className="text-red-500">Address is required</span>}

        <input {...register('city', { required: true })} placeholder="City" className="border p-2 rounded" />
        {errors.city && <span className="text-red-500">City is required</span>}

        <input {...register('state', { required: true })} placeholder="State" className="border p-2 rounded" />
        {errors.state && <span className="text-red-500">State is required</span>}

        <input type="number" {...register('contact', { required: true })} placeholder="Contact" className="border p-2 rounded" />
        {errors.contact && <span className="text-red-500">Contact is required</span>}

        <input type="email" {...register('email_id', { required: true })} placeholder="Email" className="border p-2 rounded" />
        {errors.email_id && <span className="text-red-500">Valid email is required</span>}

        <input type="file" {...register('image', { required: true })} className="border p-2 rounded" />
        {errors.image && <span className="text-red-500">Image is required</span>}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">Add School</button>
      </form>
    </div>
  );
} // <-- component ends here
