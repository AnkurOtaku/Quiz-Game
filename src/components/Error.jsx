import React, {useContext} from 'react';
import { AppContext } from '../store/store';

function Error() {
  const { error } = useContext(AppContext);
  const errorCode = [
    {code: 1, description: "No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)", solution:'Try toggling "Don\'t repeat question" off. If that doesn\'t help then Contact Developer Support with a screenshot of error and step that lead to the error.'},
    {code: 2, description: "Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)", solution:'Contact Developer Support.'},
    {code: 3, description: "Token Not Found Session Token does not exist.", solution:'Contact Developer Support.'},
    {code: 4, description: "Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.", solution:'Turn off "Don\' Repeat Question" and turn it on again.'},
    {code: 5, description: "Rate Limit Too many requests have occurred. Each IP can only access the API once every 5 seconds", solution:'We request you to not create traffic load by making unnecessary quiz requests. Try again after some time.'},
  ];
  
  return (
    <div className='p-4 border rounded-lg bg-black'>
      <div className='text-center text-xl text-red-500'>{(errorCode.find(codes=>error===codes.code)).description}</div>
      <div className='text-center text-pretty text-white'>{(errorCode.find(codes=>error===codes.code)).solution} Thank you!</div>
    </div>
  )
}

export default Error