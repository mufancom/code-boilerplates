import classNames from 'classnames';
import React, {FC} from 'react';
import styled from 'styled-components';

const PageWrapper = styled.div`
  color: #0d4f8c;
`;

export interface AboutProps {}

const About: FC<AboutProps> = () => {
  return <PageWrapper className={classNames('about')}>About Page</PageWrapper>;
};

export default About;
