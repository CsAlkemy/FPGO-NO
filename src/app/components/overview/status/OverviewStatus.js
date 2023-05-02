import _ from "@lodash";
import clsx from "clsx";
import { useTranslation } from 'react-i18next';

export const overviewStatuses = [
  {
    id: 1,
    name: "Active",
    color: "bg-active text-m-grey-700",
  },
  {
    id: 2,
    name: "Inactive",
    color: "bg-inactive text-m-grey-700",
  },
  {
    id: 3,
    name: "Confirmed",
    color: "bg-confirmed text-m-grey-700",
  },
  {
    id: 4,
    name: "Rejected",
    color: "bg-rejected text-m-grey-700",
  },
  {
    id: 5,
    name: "Pending",
    color: "bg-pending text-m-grey-700",
  },
  {
    id: 6,
    name: "Paid",
    color: "bg-paid text-m-grey-700",
  },
  {
    id: 7,
    name: "Sent",
    color: "bg-sent text-m-grey-700",
  },
  {
    id: 8,
    name: "Invoiced",
    color: "bg-invoiced text-m-grey-700",
  },
  {
    id: 7,
    name: "Expired",
    color: "bg-expired text-m-grey-700",
  },
  {
    id: 8,
    name: "Cancelled",
    color: "bg-expired text-m-grey-700",
  },
  {
    id: 9,
    name: "Refunded",
    color: "bg-sent text-m-grey-700",
  },
  {
    id: 10,
    name: "Partial Refunded",
    color: "bg-sent text-m-grey-700",
  },
  {
    id: 11,
    name: "Completed",
    color: "bg-sent text-m-grey-700",
  },
  {
    id: 12,
    name: "Reminder Sent",
    color: "bg-sent text-m-grey-700",
  },
  {
    id: 13,
    name: "Debt Collection",
    color: "bg-sent text-m-grey-700",
  },
  {
    id: 14,
    name: "Accepted",
    color: "bg-active text-m-grey-700",
  },
  {
    id: 15,
    name: "Refund Pending",
    color: "bg-pending text-m-grey-700",
  },
  {
    id: 16,
    name: "Reserved",
    color: "bg-invoiced text-m-grey-700",
  },
];

function OverviewStatus(props) {
  const {t} = useTranslation()

  let classes = "";
  props.name === "Active"
    ? (classes = "inline text-12 py-4 px-16 rounded-sm min-w-3xl")
    : props.name === "Inactive"
    ? (classes = "inline text-12 py-4 px-12 rounded-sm min-w-3xl")
    : props.name === "Sent"
    ? (classes = "inline text-12 py-4 px-24 rounded-sm min-w-3xl")
    : props.name === "Paid"
    ? (classes = "inline text-12 py-4 px-24 rounded-sm min-w-3xl")
    : props.name === "Expired"
    ? (classes = "inline text-12 py-4 px-24 rounded-sm min-w-3xl")
    : props.name === "Invoiced"
    ? (classes = "inline text-12 py-4 px-12 rounded-sm min-w-3xl")
    : props.name === "Refunded"
    ? (classes = "inline text-12 py-4 px-12 rounded-sm min-w-3xl")
    : props.name === "Partial Refunded"
    ? (classes = "text-12 py-4 px-12 rounded-sm min-w-max")
    : props.name === "Completed"
    ? (classes = "inline text-12 py-4 px-12 rounded-sm min-w-3xl")
    : props.name === "Reminder Sent"
    ? (classes = "text-12 py-4 px-12 rounded-sm min-w-max")
    : props.name === "Reminder Sent"
    ? (classes = "text-12 py-4 px-12 rounded-sm min-w-max")
    : props.name === "Debt Collection"
    ? (classes = "text-12 py-4 px-12 rounded-sm min-w-max")
    : props.name === "Rejected"
    ? (classes = "inline text-12 py-4 px-8 rounded-sm min-w-3xl")
    : props.name === "Accepted"
    ? (classes = "inline text-12 py-4 px-6 rounded-sm min-w-3xl")
    : props.name === "Refund Pending"
    ? (classes = "text-12 py-4 px-12 rounded-sm min-w-max")
    : props.name === "Reserved" 
    ? (classes = "inline text-12 py-4 px-12 rounded-sm min-w-3xl")
    : (classes = "inline text-12 py-4 px-10 rounded-sm min-w-3xl");

  return (
    <div
      className={clsx(
        classes,
        _.find(overviewStatuses, { name: props.name }).color
      )}
    >
      {props.translationKey ? t(`label:${props.translationKey}`) : props.name}
    </div>
  );
}

export default OverviewStatus;
