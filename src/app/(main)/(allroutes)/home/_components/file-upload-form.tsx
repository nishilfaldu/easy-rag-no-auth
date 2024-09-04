"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AddFilesModal } from "./add-files-modal";
import { api } from "../../../../../../convex/_generated/api";
import { addBot } from "@/actions/bot-actions";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { embeddingModels, llmModels } from "@/consts/constants";
import { uploadFilesToS3 } from "@/lib/storage";

const fileUploadFormSchema = z.object({
  name: z.string({
    required_error: "Please enter a name",
  }),
  embeddingModel: z.enum(embeddingModels, {
    required_error: "Please select an embedding model",
  }),
  completionModel: z.enum(llmModels, {
    required_error: "Please select a completion model",
  }),
});

export type FileUploadFormValues = z.infer<typeof fileUploadFormSchema>;

export default function FileUploadForm() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const defaultValues: FileUploadFormValues = useMemo(() => {
    return {
      name: "",
      embeddingModel: embeddingModels[0],
      completionModel: llmModels[0],
    };
  }, []);
  const form = useForm<FileUploadFormValues>({
    resolver: zodResolver(fileUploadFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: FileUploadFormValues) {
    if (uploadedFiles.length < 2) {
      toast.error("Please upload at least 2 files");

      return;
    }

    const uploadImageResult = await uploadFilesToS3(uploadedFiles);

    if (!uploadImageResult.success || !uploadImageResult.result) {
      toast.error("Failed to upload files");

      return;
    }

    await addBot(
      {
        completionModel: data.completionModel,
        embeddingModel: data.embeddingModel,
        name: data.name,
      },
      uploadImageResult.result
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name of the Chatbot</FormLabel>
              <FormControl>
                <Input placeholder="Enter chatbot name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Embedding Model Field */}
        <FormField
          control={form.control}
          name="embeddingModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Embedding transformer</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select embedding" />
                  </SelectTrigger>
                  <SelectContent>
                    {embeddingModels.map((embed) => (
                      <SelectItem key={embed} value={embed}>
                        {embed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Completion Model Field */}
        <FormField
          control={form.control}
          name="completionModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LLM Model</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select LLM model" />
                  </SelectTrigger>
                  <SelectContent>
                    {llmModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* File Upload Modal */}
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="file-upload">Files</Label>
          <AddFilesModal
            setUploadedFiles={setUploadedFiles}
            uploadedFiles={uploadedFiles}
          />
        </div>

        {/* Submit Button */}
        <DialogClose asChild>
          <Button type="submit" className="w-full">
            <Upload className="mr-2 h-4 w-4" /> Train
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
}
