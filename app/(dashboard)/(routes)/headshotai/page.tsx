"use client";

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/heading";
import { Download, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import fetchImages from "@/lib/fetchimages";
import { useAuth } from "@clerk/nextjs";

import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useProModal } from "@/hooks/use-pro-modal";
import { FileUpload } from "@/components/file-upload";

const HeadshotAiPage = () => {
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const proModal = useProModal();
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: "https://utfs.io/f/cd8092d2-c421-4598-8057-f9d82c4c19d3-4k0n6x.jpg",
            amount: "1",
            resolution: "512x512"
        }
    })


    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const token = await getToken({ template: 'ai-saas' }) // => "eyJhbGciOiJSUzI1NiIsImtpZC..."
        //console.log("this is the ai-saas token",token);

        const response = await axios.post("/api/fetchimages",{
            values: values,
            token: token,
        });
        console.log("response from page.tsx", response)

        } catch(e) {
                // handle error
        }
    }

    return ( 
        <div>
            <Heading
            title="Ai Headshot Generation"
            description="Create a profesional headshot photo just by uploading a few of your images."
            Icon={ImageIcon}
            iconColor="text-pink-700"
            bgColor="bg-pink-700/10"
            />
            <div className="px-4 lg:px-8 ">
                <div>
                    <Form {...form}>
                        <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        >
                        <div className="flex items-center justify-center text-center p-5">
                        <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <FileUpload
                                    endpoint="passportImage"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                        />
                        </div>
                        <div className="
                        rounded-lg
                        border
                        w-full
                        p-4
                        px-3
                        md:px-6
                        focus-within:shadow-sm
                        grid
                        grid-cols-12
                        gap-4                        
                        ">
                        
                        <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem className="col-span-12">
                                <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value}/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {amountOptions.map((option)=> (
                                            <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="resolution"
                        render={({ field }) => (
                            <FormItem className="col-span-12">
                                <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value}/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {resolutionOptions.map((option)=> (
                                            <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                        />
                        
                        <Button className="col-span-12 w-full focus:outline-none" disabled={isLoading}>
                            Generate
                        </Button>
                        </div>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-20">
                            <Loader />
                        </div>
                    )}
                    {images.length === 0 && !isLoading &&(
                       <Empty label="No images generated"/>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:gird-cols-2 gap-4 mt-8">
                        {images.map((src) => (
                        <Card 
                            key={src}
                            className="rounded-lg overflow-hidden"
                        >
                            <div className="relative aspect-square">
                                <Image
                                    alt="Image"
                                    fill
                                    src={src}
                                />
                            </div>
                            <CardFooter className="p-2">
                                <Button 
                                onClick={() => window.open(src)}
                                variant="secondary" 
                                className="w-full"
                                >
                                    <Download className="h-4 w-4 mr-2"/>
                                    Download
                                </Button>
                            </CardFooter>
                        </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default HeadshotAiPage;