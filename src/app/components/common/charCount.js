import React, {useEffect, useState} from "react";
const CharCount = ({current,total}) => {

    return (
        <div>
            <div className={`flex justify-end text-base mt-2 ${current>total? 'text-red':'text-black'}`}>{`${current}/${total}`}</div>
        </div>
    );
};
export default CharCount;
