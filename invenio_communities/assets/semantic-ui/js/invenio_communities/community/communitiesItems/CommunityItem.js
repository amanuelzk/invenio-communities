import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import axios from 'axios';
import { CommunityItemComputer } from "./CommunityItemComputer";
import { CommunityItemMobile } from "./CommunityItemMobile";
import { http } from "react-invenio-forms";
export function CommunityItem({ result }) {
  // console.log(result)
  const fetch_url = "/api/records/role";
  const [data, setData] = useState({ hits: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  let cancellableFetch;


  //where you delete the community if user is student
  const fetchData = async () => {
    setIsLoading(true);

    cancellableFetch = axios.CancelToken.source();

    try {
      const response = await axios.get(fetch_url, {
        headers: {
          Accept: "application/vnd.inveniordm.v1+json",
        },
        cancelToken: cancellableFetch.token,
      });

      setData(response.data);
      console.log(response.data)
      setIsLoading(false);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error(error);
        setError(error.response.data.message);
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchData();

    return () => {
      if (cancellableFetch) {
        cancellableFetch.cancel('Component unmounted');
      }
    };
  }, []);
 
async function deleteCommunities() {
  let filteredCommunities
  if (Array.isArray(data)) {
     filteredCommunities = data.filter(community => community.community_status === true);
    console.log(filteredCommunities);
} else {
    console.error("communityList is not an array.");
}
  const deletePromises = filteredCommunities.map(community => {
    if(community.id==result.id)
    deleteCommunity(result)
  }
    );
  
  try {
      await Promise.all(deletePromises);
      console.log("Deletion of all communities completed.");
  } catch (error) {
      console.error("Error deleting communities:", error);
  }
}
deleteCommunities()

 
  return (
    <>
      <CommunityItemComputer result={result} />
      <CommunityItemMobile result={result} />
    </>
  );
}

CommunityItem.propTypes = {
  result: PropTypes.object.isRequired,
};
const deleteCommunity =async (result) =>{
  if(result.deletion_status.is_deleted==false){
  // const {request} = this.props;
    // console.log(request.expanded.receiver.id)
    let communityId = result.id
    let baseUrl = "/api/communities";
    console.log("this is the community" + communityId)
    return http.delete(`${baseUrl}/${communityId}`, {
      
    });
  }
  }