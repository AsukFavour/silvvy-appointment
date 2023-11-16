// schemas/appointment.js

export default {
    name: 'appointment',
    title: 'Appointment List',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'email',
        title: 'Email',
        type: 'string',
        validation: (Rule) => Rule.required().email(),
      },
      {
        name: 'phoneNumber',
        title: 'Phone Number',
        type: 'string',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'service',
        title: 'Service',
        type: 'string',
        validation: (Rule) => Rule.required(),
        options: {
          list: ['Lash', 'Brows', 'Lips'],
        },
      },
      {
        name: 'subcategory',
        title: 'Subcategory',
        type: 'string',
        validation: (Rule) => Rule.required(),
        options: {
          list: [
            { title: 'Classic', value: 'Classic' },
            { title: 'Volume', value: 'Volume' },
            { title: 'Hybrid', value: 'Hybrid' },
            { title: 'Microblading', value: 'Microblading' },
            { title: 'Shading', value: 'Shading' },
            { title: 'Tinting', value: 'Tinting' },
            { title: 'Lip Blush', value: 'Lip Blush' },
            { title: 'Lip Liner', value: 'Lip Liner' },
            { title: 'Full Lips', value: 'Full Lips' },
          ],
        },
      },
      {
        name: 'date',
        title: 'Date',
        type: 'date',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'time',
        title: 'Time',
        type: 'string',
        validation: (Rule) => Rule.required(),
      },
    ],
    access: {
      create: true,
    },
    initialValue: () => ({}),
  };
  