import React, {useContext} from 'react';
import { AppContext } from '../store/store';

function Error() {
  const { error } = useContext(AppContext);
  const errorCode = [
    {code: 1, description: "No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)"},
    {code: 2, description: "Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)"},
    {code: 3, description: "Token Not Found Session Token does not exist."},
    {code: 4, description: "Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary."},
    {code: 5, description: "Rate Limit Too many requests have occurred. Each IP can only access the API once every 5 seconds"},
  ]
  return (
    <div className='mx-4 p-4 border rounded-lg mt-8 bg-black'>
      <div className='text-center text-xl text-red-500'>{(errorCode.find(codes=>error===codes.code)).description}</div>
      <div className='text-center text-white'>Please Try Again After Some Time</div>
    </div>
  )
}

export default Error