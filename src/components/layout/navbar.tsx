import React from 'react';
import './navbar.css'

interface Category {
    id: string;
    name: string;
    icon: string; // emoji hoặc icon component
}

const categories: Category[] = [
    { id: '1', name: 'Nhà Sách Tiki', icon: '📚' },
    { id: '2', name: 'Nhà Cửa - Đời Sống', icon: '🏠' },
    { id: '3', name: 'Điện Thoại - Máy Tính Bảng', icon: '📱' },
    // ... các mục khác
];

const NavBarCategory = () => {
    return (
        <>
            <div className='category'>
                <div className='name-category'>Danh mục</div>
                <ul>
                    <li>
                        <div className='item-category'>Nhà Sách</div>
                    </li>
                    <li>
                        <div className='item-category'>Nhà Sách</div>
                    </li>
                    <li>
                        <div className='item-category'>Nhà Sách</div>
                    </li>
                    <li>
                        <div className='item-category'>Nhà Sách</div>
                    </li>
                </ul>
            </div>

        </>
    );
};

export default NavBarCategory;