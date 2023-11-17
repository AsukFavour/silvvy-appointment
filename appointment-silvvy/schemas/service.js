export default {
    name: 'service',
    title: 'Service',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: (Rule) => Rule.required(),
      },
      
      
    ],
  };
  