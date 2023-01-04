import * as yup from 'yup';

export const validateSchema = yup.object().shape({
  name: yup.string() .required('You must enter Category Name'),
  description: yup.string().max(200,'Description should not be more than 200 characters')
});

export const validateSchemaProductCreate = yup.object().shape({
  productID: yup.string() .required('You must enter product Id'),
  productName: yup.string() .required('You must enter product name'),
  price: yup
    .string()
    .required('You must enter price'),
  tax: yup.string() .required('You must select tax'),
  unit: yup.string().matches(/^[a-zA-Z ]*$/,`Product Unit Can't be Number`)
});


export const defaultValue = {
  name: '',
  description: '',
  assignToProducts: [],
};

export const defaultValueCreateProduct = {
  productID: '',
  productName: '',
  price: '',
  unit: '',
  manufacturer: '',
  assignedCategories: [],
  description: '',
  tax: '',
  cost: '',
};
export const defaultValueCreateProductService = {
  productID: '',
  productName: '',
  price: '',
  unit: '',
  manufacturer: 'Test',
  assignedCategories: [],
  description: '',
  tax: '',
  cost: '',
};
