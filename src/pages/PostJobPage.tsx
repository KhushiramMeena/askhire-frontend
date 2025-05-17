// src/pages/PostJobPage.tsx

import React from 'react';
import { Helmet } from 'react-helmet-async';
import JobForm from '../components/job/JobForm';

const PostJobPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Post a Job | Askhire</title>
        <meta 
          name="description" 
          content="Post a new job opening on Askhire and connect with qualified candidates." 
        />
      </Helmet>
      
      <JobForm />
    </>
  );
};

export default PostJobPage;