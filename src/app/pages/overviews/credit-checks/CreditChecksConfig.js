import authRoles from '../../../data-access/utils/AuthRoles';
import CreditChecksListOverview from "./CreditChecksListOverview";
import CreditCheckCorporateClient from '../../../components/creditCheck/corporateCreditCheck/CreditCheckCorporateClient';
import CreditCheckPrivateClient from '../../../components/creditCheck/privateCreditCheck/CreditCheckPrivateClient';

const CreditChecksConfig = {
    settings: {
        layout: {
            config: {
                navbar: {
                    display: true,
                },
                toolbar: {
                    display: true,
                },
                footer: {
                    display: false,
                },
                leftSidePanel: {
                    display: false,
                },
                rightSidePanel: {
                    display: false,
                },
            },
        },
    },
    auth: [`${authRoles.user[0]}`, `${authRoles.businessAdmin[0]}`],
    routes: [
        {
            path: '/credit-check/credit-checks-list',
            element: <CreditChecksListOverview />,
        },
        {
            path: '/credit-check/corporate-client',
            element: <CreditCheckCorporateClient />,
        },
        {
            path: '/credit-check/private-client',
            element: <CreditCheckPrivateClient />,
        },
    ],
};

export default CreditChecksConfig;
