import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import './index.scss'

interface IProps {
  total: number
  currentPage: number
  pageSize: number
  getPaginations: any
}

const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
  if (type === 'prev') {
    return <a>Previous</a>;
  }
  if (type === 'next') {
    return <a>Next</a>;
  }
  return originalElement;
};

function Paginations ({ total, currentPage, pageSize, getPaginations }: IProps) {
 
  const handleChange = (page: number, pageSize: number) => {
    getPaginations(page, pageSize)
  };

  return (
  <div className="pagination">
    <Pagination
      total={total}
      itemRender={itemRender}
      current={currentPage}
      pageSize={pageSize}
      onChange={handleChange}
      size='small'
    />
  </div>
  )
}

export default Paginations