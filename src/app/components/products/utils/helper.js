import * as yup from 'yup';

export const validateSchema = yup.object().shape({
  name: yup.string() .required('youMustEnterCategoryName'),
  description: yup.string().max(200,'descriptionCharacterLimitationRule')
});

export const validateSchemaProductCreate = yup.object().shape({
  productID: yup.string() .required('youMustEnterProductId'),
  productName: yup.string() .required('youMustEnterProductName'),
  price: yup
    .string()
    .matches(/^[0-9,]+$/)
    .required('youMustEnterPrice'),
  tax: yup.string() .required('youMustSelectTax'),
  unit: yup.string().matches(/^[a-zA-Z ]*$/,`productUnitCanTBeNumber`)
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
