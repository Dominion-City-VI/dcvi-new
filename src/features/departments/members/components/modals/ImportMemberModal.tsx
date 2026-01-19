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
import { postUploadCellMember } from '@/requests/cell';
import { Loader } from 'lucide-react';
import { PHONEBOOK } from '@/constants/api';
import { parseError } from '@/utils/errorHandler';
import { useStyledToast } from '@/hooks/custom/useStyledToast';
import { AxiosError } from 'axios';
import { postUploadDepartmentMember } from '@/requests/department';

const formSchema = z.object({
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

export type TFormSchema = z.infer<typeof formSchema>;

export default function ImportMemberModal() {
  const toast = useStyledToast();
  const {
    AppConfigStore: { toggleModals, isOpen }
  } = useStore();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postUploadDepartmentMember,
    onError: (error: AxiosError<any>) => {
      toast.error(parseError(error));
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

  const onSubmit = (formData: TFormSchema) => {
    const { File } = formData;

    if (File && File[0]) {
      mutate({ File: File[0] as File });
    }
  };

  function downloadSampleExcel() {
    const a = document.createElement('a');
    a.href = '/2025-Church-Membership.xlsx';
    a.download = '2025-Church-Membership.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <XModal isOpen={isOpen.IMPORT_MEMBER_MODAL} closeModal={() => isPending || toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import members</DialogTitle>
          <DialogDescription>Import members quickly from an excel file.</DialogDescription>
          <a
            href="#"
            onClick={() => downloadSampleExcel()}
            className="text-primary w-fit cursor-pointer text-sm hover:underline"
          >
            Download template
          </a>
        </DialogHeader>
        <Form {...form}>
          <form id="pb-import-form" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isPending} className="flex flex-col space-y-1">
              <FormField
                control={form.control}
                name="File"
                render={() => (
                  <InputField
                    type="file"
                    label="Excel File"
                    placeholder="upload only .xsl or .xlsx files"
                    accept='xls, xlsx'
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
