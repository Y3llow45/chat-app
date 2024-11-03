import { useNavigate } from 'react-router-dom';
import { ComponentType } from 'react';

interface WithNavigateProps {
  navigate: ReturnType<typeof useNavigate>;
}

const navWrap = <P extends object>(WrappedComponent: ComponentType<P & WithNavigateProps>) => {
  const ComponentWithNavigate = (props: P) => {
    const navigate = useNavigate();

    return <WrappedComponent {...props} navigate={navigate} />;
  };

  return ComponentWithNavigate;
};

export default navWrap;
