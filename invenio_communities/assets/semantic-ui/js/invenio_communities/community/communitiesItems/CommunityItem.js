import React from "react";
import PropTypes from "prop-types";

import { CommunityItemComputer } from "./CommunityItemComputer";
import { CommunityItemMobile } from "./CommunityItemMobile";
import { http } from "react-invenio-forms";
export function CommunityItem({ result }) {
  console.log(result)
  deleteCommunity(result)
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