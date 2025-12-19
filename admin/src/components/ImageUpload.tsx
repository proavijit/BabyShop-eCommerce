import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/config';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, className }) => {
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);


    useEffect(() => {
        setPreview(value || null);
    }, [value]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Validation
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        const promise = (async () => {
            try {
                const { data } = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (data.success) {
                    onChange(data.url);
                    setPreview(data.url);
                    return data;
                }
                throw new Error(data.message || 'Upload failed');
            } catch (error: any) {
                throw new Error(error.response?.data?.message || error.message || 'Failed to upload');
            }
        })();

        toast.promise(promise, {
            loading: 'Uploading image to Cloudinary...',
            success: 'Image uploaded successfully!',
            error: (err) => err.message
        });

        try {
            await promise;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
        disabled: loading
    });

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onChange('');
    };

    return (
        <div className={`relative ${className}`}>
            <div
                {...getRootProps()}
                className={`
                    flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl transition-all cursor-pointer
                    ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    min-h-[140px]
                `}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <div className="relative group w-full h-full flex flex-col items-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-24 h-24 rounded-xl object-cover border border-white/10 shadow-lg"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-2 right-1/2 translate-x-12 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <p className="mt-2 text-[10px] text-slate-500 font-medium">Click or drag to replace</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                        {loading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        ) : (
                            <Upload className={`w-8 h-8 ${isDragActive ? 'text-blue-500' : 'text-slate-500'}`} />
                        )}
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-300">
                                {isDragActive ? 'Drop image here' : 'Drop avatar here'}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1">PNG, JPG, WebP (Max 5MB)</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
