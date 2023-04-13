
import { yupResolver } from "@hookform/resolvers/yup";
import { ClickAwayListener } from "@mui/base";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Backdrop,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    Hidden,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from "@mui/material";

import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";

import {
    CreateOrderDefaultValue,
    validateSchemaCreateOrderCorporate,
    validateSchemaCreateOrderCorporateOrderBySms,
    validateSchemaCreateOrderPrivate,
    validateSchemaCreateOrderPrivateOrderByEmail,
} from "../utils/helper";

const CustomerModal = () => {
    const { t } = useTranslation();

    return (
        <>
            <form
            name=""
            noValidate
            onSubmit=""
            >
                <div className="modal-container">
                    <Dialog 
                    className="create-customer-modal" 
                    open={openCreateCustomer} 
                    onClose={ () => {
                        setOpenCreateCustomer(false); 
                    }}
                    >
                    <DialogTitle>
                        { selectedCustomer 
                        ? t("label:editCustomerDetails") 
                        : customData.customerType == 'corporate' 
                            ? t("label:createCorporateCustomer") 
                            : t("label:createPrivateCustomer")}
                    </DialogTitle>
                    <DialogContent>
                        <div className="w-full my-32">
                        <div className="form-pair-input gap-x-20">
                            <Controller
                            name="primaryPhoneNumber"
                            control={control}
                            render={({ field }) => (
                                <FormControl
                                error={!!errors.primaryPhoneNumber}
                                fullWidth
                                >
                                <PhoneInput
                                    {...field}
                                    className={
                                    errors.primaryPhoneNumber
                                        ? "input-phone-number-field border-1 rounded-md border-red-300"
                                        : "input-phone-number-field"
                                    }
                                    country="no"
                                    enableSearch
                                    autocompleteSearch
                                    countryCodeEditable={false}
                                    specialLabel={`${t("label:phone")}*`}
                                    // onBlur={handleOnBlurGetDialCode}
                                    value={field.value || ""}
                                />
                                <FormHelperText>
                                    {errors?.primaryPhoneNumber?.message
                                    ? t(
                                        `validation:${errors?.primaryPhoneNumber?.message}`
                                        )
                                    : ""}
                                </FormHelperText>
                                </FormControl>
                            )}
                            />
                            <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                {...field}
                                label={t("label:email")}
                                type="email"
                                autoComplete="off"
                                error={!!errors.email}
                                helperText={
                                    errors?.email?.message
                                    ? t(
                                        `validation:${errors?.email?.message}`
                                        )
                                    : ""
                                }
                                variant="outlined"
                                fullWidth
                                required
                                value={field.value || ""}
                                />
                            )}
                            />
                        </div>
                        <div className="mt-32 sm:mt-0">
                            <div className="form-pair-input gap-x-20">
                            <Controller
                                name="customerName"
                                control={control}
                                render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={t("label:customerName")}
                                    type="text"
                                    autoComplete="off"
                                    error={!!errors.customerName}
                                    helperText={
                                    errors?.customerName?.message
                                        ? t(
                                            `validation:${errors?.customerName?.message}`
                                        )
                                        : ""
                                    }
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={field.value || ""}
                                />
                                )}
                            />
                            {customData.customerType === "corporate" && (
                                <Controller
                                name="orgID"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                    {...field}
                                    label={t("label:organizationId")}
                                    type="number"
                                    autoComplete="off"
                                    error={!!errors.orgID}
                                    required
                                    helperText={
                                        errors?.orgID?.message
                                        ? t(
                                            `validation:${errors?.orgID?.message}`
                                            )
                                        : ""
                                    }
                                    variant="outlined"
                                    fullWidth
                                    value={field.value || ""}
                                    />
                                )}
                                />
                            )}
                            {customData.customerType === "private" && (
                                <Controller
                                name="pNumber"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                    {...field}
                                    label={t("label:pNumber")}
                                    type="number"
                                    autoComplete="off"
                                    error={!!errors.pNumber}
                                    helperText={
                                        errors?.pNumber?.message
                                        ? t(
                                            `validation:${errors?.pNumber?.message}`
                                            )
                                        : ""
                                    }
                                    // ref={orgOrPNumberRef}
                                    variant="outlined"
                                    fullWidth
                                    value={field.value || ""}
                                    />
                                )}
                                />
                            )}
                            </div>
                        </div>
                        <div className="">
                            <div className="form-pair-three-by-one">
                            <div className="col-span-3">
                                <Controller
                                name="billingAddress"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                    {...field}
                                    label={t("label:streetAddress")}
                                    type="text"
                                    autoComplete="off"
                                    error={!!errors.billingAddress}
                                    helperText={
                                        errors?.billingAddress?.message
                                        ? t(
                                            `validation:${errors?.billingAddress?.message}`
                                            )
                                        : ""
                                    }
                                    variant="outlined"
                                    fullWidth
                                    inputlabelprops={{
                                        shrink:
                                        !!field.value ||
                                        touchedFields.billingAddress,
                                    }}
                                    required={customData.paymentMethod.includes(
                                        "invoice"
                                    )}
                                    value={field.value || ""}
                                    />
                                )}
                                />
                            </div>
                            <div className="col-span-1">
                                <Controller
                                name="billingZip"
                                className="col-span-1"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                    {...field}
                                    label={t("label:zipCode")}
                                    type="text"
                                    autoComplete="off"
                                    error={!!errors.billingZip}
                                    helperText={
                                        errors?.billingZip?.message
                                        ? t(
                                            `validation:${errors?.billingZip?.message}`
                                            )
                                        : ""
                                    }
                                    variant="outlined"
                                    fullWidth
                                    inputlabelprops={{
                                        shrink:
                                        !!field.value ||
                                        touchedFields.billingZip,
                                    }}
                                    required={customData.paymentMethod.includes(
                                        "invoice"
                                    )}
                                    value={field.value || ""}
                                    />
                                )}
                                />
                            </div>
                            </div>
                            <div className="form-pair-input gap-x-20">
                            <Controller
                                name="billingCity"
                                control={control}
                                render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={t("label:city")}
                                    type="text"
                                    autoComplete="off"
                                    error={!!errors.billingCity}
                                    helperText={
                                    errors?.billingCity?.message
                                        ? t(
                                            `validation:${errors?.billingCity?.message}`
                                        )
                                        : ""
                                    }
                                    variant="outlined"
                                    fullWidth
                                    inputlabelprops={{
                                    shrink:
                                        !!field.value ||
                                        touchedFields.billingCity,
                                    }}
                                    required={customData.paymentMethod.includes(
                                    "invoice"
                                    )}
                                    value={field.value || ""}
                                />
                                )}
                            />

                            <Controller
                                name="billingCountry"
                                control={control}
                                render={({ field }) => (
                                <FormControl
                                    error={!!errors.billingCountry}
                                    fullWidth
                                >
                                    <InputLabel id="billingCountry">
                                    {t("label:country")}*
                                    </InputLabel>
                                    <Select
                                    {...field}
                                    labelId="billingCountry"
                                    id="select"
                                    label={t("label:country")}
                                    inputlabelprops={{
                                        shrink: !!field.value,
                                    }}
                                    value={field.value || ""}
                                    >
                                    {countries.length ? (
                                        countries.map((country, index) => {
                                        return (
                                            <MenuItem
                                            key={index}
                                            value={country.name}
                                            >
                                            {country.title}
                                            </MenuItem>
                                        );
                                        })
                                    ) : (
                                        <MenuItem key={0} value="norway">
                                        Norway
                                        </MenuItem>
                                    )}
                                    </Select>
                                    <FormHelperText>
                                    {errors?.billingCountry?.message
                                        ? t(
                                            `validation:${errors?.billingCountry?.message}`
                                        )
                                        : ""}
                                    </FormHelperText>
                                </FormControl>
                                )}
                            />
                            </div>
                        </div>
                        </div>
                    </DialogContent>
                    <DialogActions className="dialogue-btn-container">
                        <Button className="body3x lg-blue-btn" variant="outlined" onClick={ () => {setOpenCreateCustomer(false) }}>
                        {t("label:cancel")}
                        </Button>
                        { selectedCustomer ? (
                        <Button className="body3x lg-blue-btn" variant="outlined" onClick={ () => {setOpenCreateCustomer(false) }}>
                            {t("label:update")}
                        </Button>
                        ) : (
                        <Button className="body3x lg-blue-btn" variant="outlined" onClick={ () => {console.log(errors.primaryPhoneNumber) }}>
                        {t("label:create")}
                        </Button>
                        )}
                    </DialogActions>
                    </Dialog>
                </div>
            </form>
        </>
    )
}
export default CustomerModal;