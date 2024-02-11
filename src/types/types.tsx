
export type Contact = {
    name: string;
    phoneNumbers: string[];
    labels: string | null;
    emails: string[];
    photoURL?: string | null;
    address: {
      street: string|null;
      city: string|null;
      state: string|null;
      postalCode: string|null;
    };
    id:Id
  }   ;

export  type Id = string| number