import React from 'react';
import { shallow } from 'enzyme';
import TempTable from '../components/TempTable.jsx';

describe('TempTable', () => {
    it(' should have "h3" "Temperature in next five days in Wroclaw" ', () => {
        const wrapper = shallow(<TempTable />);
        expect(wrapper.contains(<h3>Temperature in next five days in Wroclaw</h3>)).toBe(true);
    })
})