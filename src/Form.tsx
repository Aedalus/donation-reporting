import { useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  OnSubmit: (data: { csv: string; filerId: string }) => void;
};
export type Inputs = {
  file: FileList;
  filerId: string;
};

export function Form(props: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const selectedFile = data.file[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvContent = e.target?.result;
        props.OnSubmit({ csv: csvContent as string, filerId: data.filerId });
      };
      reader.readAsText(selectedFile);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Upload a file:
        <input
          type="file"
          accept=".csv"
          {...register("file", { required: true })}
        />
        {errors.file && <span>This field is required</span>}
      </label>
      <label>
        Filer ID
        <input {...register("filerId", { required: true })} />
        {errors.filerId && <span>This field is required</span>}
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
