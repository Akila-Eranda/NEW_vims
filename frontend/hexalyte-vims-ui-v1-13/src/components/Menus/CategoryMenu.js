import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';


function CategoryMenu({ deleteCategory, editCategory, row }) {

    return (
        <Menu menuButton={<MenuButton className="p-2 rounded-full"> <i className="fa fa-ellipsis-v"></i> </MenuButton>} transition>
            <MenuItem onClick={() => editCategory(row)} > <i className="fa fa-pencil-alt px-1"></i> Edit</MenuItem>
            <MenuItem onClick={() => deleteCategory(row)} > <i className="fa fa-trash-alt px-1"></i> Delete</MenuItem>
        </Menu>
    );
}

export default CategoryMenu