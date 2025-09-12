import React from 'react';
import { Helmet } from 'react-helmet';

const AdSenseScript: React.FC = () => {
  return (
    <Helmet>
      <script 
        async 
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9581059198364443"
        crossOrigin="anonymous"
      />
    </Helmet>
  );
};

export default AdSenseScript;



