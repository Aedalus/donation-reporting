import { useForm, type SubmitHandler } from "react-hook-form";

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "10px",
  marginTop: "20px",
};

type Props = {
  OnSubmit: (data: SubmitData) => void;
};

// Raw inputs for the form
export type FormData = {
  file: FileList;
  filerId: string;
  contactIdDonorbox: string;
  contactIdStripe: string;
  contactIdPaypal: string;
  transactionsOnly: boolean;
};

// Form data after parsing
export type SubmitData = {
  csv: string;
  filerId: string;
  contactIdDonorbox: string;
  contactIdStripe: string;
  contactIdPaypal: string;
  transactionsOnly: boolean;
};

export function Form(props: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit: SubmitHandler<FormData> = (data) => {
    const selectedFile = data.file[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvContent = e.target?.result;
        props.OnSubmit({ ...data, csv: csvContent as string });
      };
      reader.readAsText(selectedFile);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label style={labelStyle}>
        Upload a file:
        <input
          type="file"
          accept=".csv"
          {...register("file", { required: true })}
        />
        {errors.file && <span>This field is required</span>}
      </label>
      <label style={labelStyle}>Filer ID</label>
      <input {...register("filerId", { required: true })} />
      {errors.filerId && <span>This field is required</span>}
      <label style={labelStyle}>Contact ID - Donorbox</label>
      <input {...register("contactIdDonorbox", { required: true })} />
      {errors.contactIdDonorbox && <span>This field is required</span>}
      <label style={labelStyle}>Contact ID - Stripe</label>
      <input {...register("contactIdStripe", { required: true })} />
      {errors.contactIdStripe && <span>This field is required</span>}
      <label style={labelStyle}>Contact ID - Paypal</label>
      <input {...register("contactIdPaypal", { required: true })} />
      {errors.contactIdPaypal && <span>This field is required</span>}

      <label style={labelStyle}>Transactions Only</label>
      <input type="checkbox" {...register("transactionsOnly")} />

      <button type="submit" style={{ display: "block", marginTop: "20px" }}>
        Submit
      </button>
    </form>
  );
}
