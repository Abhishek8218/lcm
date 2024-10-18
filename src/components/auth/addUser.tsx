// components/UserForm.tsx
'use client'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';

import { AddUser } from '@/src/services/user';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Yup validation schema
const schema = yup.object().shape({
  userName: yup.string().required('Username is required'),
  role: yup.string().required('Role is required'),
  password: yup.string().min(4, 'Password must be at least 4 characters').required('Password is required'),
});

// Interface for form data
interface UserFormData {
  userName: string;
  role: string;
  password: string;
}

const UserForm: React.FC = () => {
  // React Hook Form setup with Yup validation resolver
  const { control, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: yupResolver(schema),
  });
  const router = useRouter();


   // TanStack Query mutation using the `createUser` function and query key
   const addUser = useMutation({
        mutationKey: ['createUser'],
        mutationFn: AddUser,
        onSuccess: () => {
            console.log('User created successfully!');
            toast.success('User created successfully!');
            window.location.href = '/'; // Redirect to dashboard or any other page
        }
   });

  // Form submit handler
  const onSubmit = (data: UserFormData) => {
    addUser.mutate(data)
    // addUser.mutate(data, {
    // //   onSuccess: () => {
    // //     setSubmitSuccess('User created successfully!');
    // //   },
    // //   onError: (error) => {
    // //     console.error('Error creating user:', error);
    // //     setSubmitSuccess('Failed to create user');
    // //   },
    // });
  };

  return (
    <div className='bg-white'>
 <header className="flex items-center justify-start gap-[25%] p-4 bg-main text-white">
        <ArrowLeft className="w-6 h-6" onClick={() => { router.push("/") }} />
        <div className="text-lg text-center font-semibold">New User</div>
      </header>

    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md  p-6 bg-white rounded-lg">
      {/* Username Field */}
      <div className="mb-4">
        <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <Controller
          name="userName"
          control={control}
          render={({ field }) => (
            <input
              type="text"
              id="userName"
              {...field}
              className="mt-1 p-2 w-full border rounded-md"
            />
          )}
        />
        {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}
      </div>

      {/* Role Field */}
      <div className="mb-4">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <select
              id="role"
              {...field}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="manager">manager</option>
            </select>
          )}
        />
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
      </div>

      {/* Password Field */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <input
              type="password"
              id="password"
              {...field}
              className="mt-1 p-2 w-full border rounded-md"
            />
          )}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded-md"
        disabled={addUser.isPending}
      >
        {addUser.isPending ? 'Creating User...' : 'Create User'}
      </button>

    </form>
    </div>
  );
};

export default UserForm;
