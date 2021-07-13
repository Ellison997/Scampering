import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {
  return (
    <DefaultFooter
      copyright={`2020 花小鹿科技出品`}
      links={[
        {
          title: '城市民宿',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          title: <GithubOutlined />,
          href: 'https://github.com/Ellison997',
          blankTarget: true,
        },
        {
          title: '爱笑集团',
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
    />
  );
};
