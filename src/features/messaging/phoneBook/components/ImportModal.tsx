import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useStore } from '@/store';
import { z } from 'zod';
import InputField from '@/components/fields/InputField';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postImportPhonebook } from '@/requests/phonebook';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { numberRegex } from '@/utils';
import { PHONEBOOK } from '@/constants/api';

const formSchema = z.object({
  Name: z
    .string()
    .trim()
    .min(2, { message: 'Name is required.' })
    .refine((value) => numberRegex.test(value) === false, 'Numbers not allowed.'),
  File: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: 'Please upload a file'
    })
    .refine(
      (files) =>
        [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel'
        ].includes(files?.[0]?.type),
      'Please upload Excel format (.xlsx or .xls).'
    )
});

type TFormSchema = z.infer<typeof formSchema>;

export default function ImportModal() {
  const {
    AppConfigStore: { toggleModals, isOpen }
  } = useStore();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postImportPhonebook,
    onError: () => {
      toast.error('Error uploading Phonebook!');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] == PHONEBOOK.GET_USER_PHONEBOOK
      });
      toast.success(data.data.message);
      toggleModals({});
    }
  });

  const form = useForm<TFormSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
    reValidateMode: 'onChange'
  });

  const fileRef = form.register('File');
  const nameRef = form.register('Name');

  const onSubmit = (formData: TFormSchema) => {
    const { Name, File } = formData;

    console.log(File[0]);

    if (File && File[0]) {
      mutate({ Name, File: File[0] as File });
    }
  };

  function downloadSampleExcel() {
    const csvContent =
      'Name,PhoneNumber\nJohn Smith,555-0123\nSarah Johnson,555-0456\nMichael Brown,555-0789';

    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-format.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  return (
    <XModal isOpen={isOpen.IMPORT_PHONEBOOK} closeModal={() => isPending || toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import phonebook</DialogTitle>
          <DialogDescription>Import phonebook quickly from an excel file.</DialogDescription>
          <a
            href="#"
            onClick={() => downloadSampleExcel()}
            className="text-primary cursor-pointer text-sm hover:underline"
          >
            Download sample format
          </a>
        </DialogHeader>
        <Form {...form}>
          <form id="pb-import-form" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isPending} className="flex flex-col space-y-1">
              <FormField
                control={form.control}
                name="Name"
                render={() => (
                  <InputField type="text" label="Name" placeholder="new phonebook" {...nameRef} />
                )}
              />
              <FormField
                control={form.control}
                name="File"
                render={() => (
                  <InputField
                    type="file"
                    label="Excel File"
                    placeholder="upload only .xsl or .xlsx files"
                    {...fileRef}
                  />
                )}
              />
            </fieldset>
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose disabled={isPending} asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button disabled={isPending} type="submit" form="pb-import-form">
            {isPending && <Loader className="animate-spin" />}
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}
