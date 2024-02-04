// This file is part of Invenio
// Copyright (C) 2022-2023 CERN.
//
// Invenio is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from "@translations/invenio_communities/i18next";
import PropTypes from "prop-types";
import React,{useEffect,useState} from "react";
import { withState } from "react-searchkit";
import { Input } from "semantic-ui-react";
import {http} from "react-invenio-forms"
import {
  MobileRequestItem,
  ComputerTabletRequestItem,
} from "@js/invenio_requests/search";

export const RecordSearchBarElement = withState(
  ({
    placeholder: passedPlaceholder,
    queryString,
    onInputChange,
    updateQueryState,
    currentQueryState,
  }) => {
    const placeholder = passedPlaceholder || i18next.t("Search");

    const onSearch = () => {
      updateQueryState({ ...currentQueryState, queryString });
    };

    const onBtnSearchClick = () => {
      onSearch();
    };
    const onKeyPress = (event) => {
      if (event.key === "Enter") {
        onSearch();
      }
    };
    return (
      <Input
        action={{
          "icon": "search",
          "onClick": onBtnSearchClick,
          "className": "search",
          "aria-label": i18next.t("Search"),
        }}
        fluid
        placeholder={placeholder}
        onChange={(event, { value }) => {
          onInputChange(value);
        }}
        value={queryString}
        onKeyPress={onKeyPress}
      />
    );
  }
);

export const RequestsResultsItemTemplateCommunity = ({ result, community }) => {
  const ComputerTabletRequestsItemWithState = withState(ComputerTabletRequestItem);
  const MobileRequestsItemWithState = withState(MobileRequestItem);
  const detailsURL = `/communities/${community.slug}/requests/${result.id}`;

  const [filteredResult, setFilteredResult] = useState(null);

  useEffect(() => {
    const request = async () => {
      try {
        const resp = await http.post(
          'https://127.0.0.1:5000/api/records/request_num',
          result,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );

        const account_id = resp.data.owner_id;
        const statusValues = resp.data.status.length;
        const exists = resp.data.status.some(item => item.owner_id === account_id || item.owner_Id === account_id);

       
      
        if (resp.data.id === result.id && !exists) {
            setFilteredResult(result);
            
          }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    request();
  }, [result]); 

  if (filteredResult === null) {
    return <p></p>;
  }

 
  return (
    <>
      <ComputerTabletRequestsItemWithState result={filteredResult} detailsURL={detailsURL} />
      <MobileRequestsItemWithState result={filteredResult} detailsURL={detailsURL} />
    </>
  );
};
RequestsResultsItemTemplateCommunity.propTypes = {
  result: PropTypes.object.isRequired,
  community: PropTypes.object.isRequired,
};
