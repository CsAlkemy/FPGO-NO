import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, div } from '@mui/material';
import { useTranslation } from 'react-i18next';

const faqs = () => {
  const {t} = useTranslation()
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    { id:1,
      question: t("label:whatIsCreditCheck"),
      answer: t("label:whatIsCreditCheckAns"),
    },
    {
      id:2,
      question: t("label:whatIsTheDifferenceCustomer"),
      answer: t("label:whatIsTheDifferenceCustomerAns"),
    },
    {
      id:3,
      question: t("label:whatIsTheDifferenceCustomer"),
      answer: t("label:whatIsTheDifferenceCustomerAns"),
    },
  ];
  return (
    //TODO: Delete the hidden class if you want to see the faqs
    <div className='hidden'>
      <div className="p-16 bg-primary-25">
        <h3 className="subtitle2 mb-2">{t("label:faqs")}</h3>
      </div>
      <div>
      {faqs.map(faq => (
        <Accordion key={faq.id}  expanded={expanded === `panel${faq.id}`} onChange={handleChange(`panel${faq.id}`)} className="shadow-0 border-b-1 border-MonochromeGray-25" >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel2a-header">
                <div className={ expanded === `panel${faq.id}` ?'subtitle2 text-main':'subtitle2 text-MonochromeGray-500 hover:text-main'}>
                {faq.question}
                </div>
            </AccordionSummary>
            <AccordionDetails className="bg-white body2">
                {faq.answer}
            </AccordionDetails>
        </Accordion>
      ))}
      </div>
    </div>
  );
};

export default faqs;
