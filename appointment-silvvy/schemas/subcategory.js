export default {
    name: 'subcategory',
    title: 'Subcategory',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'service',
        title: 'Service',
        type: 'reference',
        to: [{ type: 'service' }],
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'price',
        title: 'Price',
        type: 'number', // You can use other types based on your requirements
        validation: (Rule) => Rule.required(),
      },
    ],
  };
  