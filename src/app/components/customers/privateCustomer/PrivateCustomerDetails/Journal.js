import { DesktopDatePicker, LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import React, { useEffect } from 'react';
import CustomersService from "../../../../data-access/services/customersService/CustomersService";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Journal = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(true);
  const [defaultJournal, setDefaultJournal] = React.useState(true);
  const [journals, setJournals] = React.useState([]);
  const [notes, setNotes] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(
    new Date(
      `${new Date().getMonth() + 1}.09.${new Date().getFullYear()} 00:00:00`
    )
  );
  const { id } = useParams();

  const handleDateChange = (date) => {
    setIsFetching(true);
    setDefaultJournal(false);
    const prepareSelectedDate = `${new Date(date).getMonth() + 1}.09.${new Date(
      date
    ).getFullYear()} 00:00:00`;
    // setSelectedDate(date);
    const timeStamp = new Date(prepareSelectedDate).getTime() / 1000;
    setSelectedDate(prepareSelectedDate);

    CustomersService.getCutomerJournals(id, timeStamp)
      .then((response) => {
        const sameDates = [];
        const mappedData = response?.data.map((d) => {
          return {
            date: sameDates.includes(d.datetime.split(" ")[0])
              ? null
              : sameDates.push(d.datetime.split(" ")[0]) &&
              d.datetime.split(" ")[0],
            time: d.datetime.split(" ")[1],
            text: d.text,
          };
        });
        // setJournals(response?.data);
        setJournals(mappedData);
        // setJournals(response?.data);
        setIsFetching(false);
      })
      .catch((e) => {
        setJournals([]);
        setIsFetching(false);
      });
  };

  useEffect(() => {
    if (defaultJournal && isFetching) {
      const stDate = new Date(selectedDate).getTime() / 1000;
      CustomersService.getCutomerJournals(id, stDate)
        .then((response) => {
          const sameDates = [];
          const mappedData = response?.data.map((d) => {
            return {
              date: sameDates.includes(d.datetime.split(" ")[0])
                ? null
                : sameDates.push(d.datetime.split(" ")[0]) &&
                  d.datetime.split(" ")[0],
              time: d.datetime.split(" ")[1],
              text: d.text,
            };
          });
          // setJournals(response?.data);
          setJournals(mappedData);
          setIsFetching(false);
        })
        .catch((e) => {
          setJournals([]);
          setIsFetching(false);
        });
    }
  }, [isFetching]);

  const addNotes = ()=> {
    setLoading(true)
    CustomersService.addCustomerJournal(id, notes)
      .then((response)=> {
        setNotes("")
        setLoading(false)
        setIsFetching(true)
        const stDate = new Date(selectedDate).getTime() / 1000;
        CustomersService.getCutomerJournals(id, stDate)
          .then((response) => {
            const sameDates = [];
            const mappedData = response?.data.map((d) => {
              return {
                date: sameDates.includes(d.datetime.split(" ")[0])
                  ? null
                  : sameDates.push(d.datetime.split(" ")[0]) &&
                  d.datetime.split(" ")[0],
                time: d.datetime.split(" ")[1],
                text: d.text,
              };
            });
            // setJournals(response?.data);
            setJournals(mappedData);
            setIsFetching(false);
          })
          .catch((e) => {
            setJournals([]);
            setIsFetching(false);
          });
      })
      .catch((e)=> {
        setLoading(false)
      })
  }

  return (
    <div className="w-full sm:w-3/4">
      <TextField
        multiline
        className="col-span-2"
        rows={12}
        value={notes}
        type="text"
        placeholder={t("label:typeHere")}
        autoComplete="off"
        variant="outlined"
        fullWidth
        onChange={(e)=> setNotes(e.target.value)}
      />
      <div className="flex justify-end items-center mt-20 mb-40">
        <LoadingButton
          variant="contained"
          color="secondary"
          className=" w-full sm:w-auto rounded-4 button2"
          aria-label="Add Entry"
          size="large"
          type="button"
          loading={loading}
          loadingPosition="center"
          onClick={()=> addNotes()}
        >
           {t("label:addEntry")}
        </LoadingButton>
      </div>
      <hr />
      <div className="my-20 flex justify-end">
        <DesktopDatePicker
          inputFormat="MM.yyyy"
          views={["year", "month"]}
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} error={false} type="date" />}
          disableFuture
        />
      </div>
      <div>
        {journals.length
          ? journals.map((journal) => {
            return (
              <>
                {journal?.date && (
                  <div className="mb-10 text-MonochromeGray-500 subtitle2 ">
                    {journal.date}
                  </div>
                )}
                <div className="p-20 bg-MonochromeGray-25 text-MonochromeGray-900 body2 rounded-16">
                  {journal.text}
                </div>
                <div className="mt-7 body3 text-MonochromeGray-300">
                  {journal.time}
                </div>
                <br />
              </>
            );
          })
          : ""}
        {/*<div className="mb-10 text-MonochromeGray-500 subtitle2 ">25.10.22</div>*/}
        {/*<div className="p-20 bg-MonochromeGray-25 text-MonochromeGray-900 body2 rounded-16">*/}
        {/*  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum*/}
        {/*  delectus recusandae quisquam vel inventore, in aspernatur sapiente id*/}
        {/*  sequi obcaecati animi. Reprehenderit dicta magni totam labore in*/}
        {/*  maxime praesentium laudantium ipsam! Minima id amet odit laudantium*/}
        {/*  quam, veritatis dolore doloribus numquam ipsam veniam in animi*/}
        {/*  voluptas voluptatum nihil accusantium sint!*/}
        {/*</div>*/}
        {/*<div className="mt-7 body3 text-MonochromeGray-300">15:17</div>*/}
        {/*<br />*/}
        {/*<div className="p-20 bg-MonochromeGray-50 text-MonochromeGray-900 body2 rounded-16">*/}
        {/*  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum*/}
        {/*</div>*/}
        {/*<div className="mt-7 body3 text-MonochromeGray-300">15:17</div>*/}
      </div>
    </div>
  );
};

export default Journal;
