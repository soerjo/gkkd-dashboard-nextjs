import * as React from 'react';
import { components, ControlProps, GroupBase, Props } from "react-select";
import ReactSelectAsync, { AsyncProps } from "react-select/async";
import { defaultClassNames, defaultStyles } from '@/lib/helper';
import {
    ClearIndicator,
    DropdownIndicator,
    MultiValueRemove,
    Option
} from './components';

type TCustomAsyncSelect = (
    props: Props &
        Pick<
            AsyncProps<unknown, boolean, GroupBase<unknown>>,
            "defaultOptions" | "cacheOptions" | "loadOptions" | "isLoading"
        >
) => JSX.Element;

const Control:
    | React.ComponentType<ControlProps<unknown, boolean, GroupBase<unknown>>>
    | undefined = (props) => (
        <div style={{ backgroundColor: "pink", padding: "10px 20px" }}>
            <p>dynamic label title here</p>
            <components.Control {...props} />
        </div>
    );

const AsyncSelect: TCustomAsyncSelect = (props: Props) => {
    return (
        <ReactSelectAsync
            unstyled
            components={{
                DropdownIndicator,
                ClearIndicator,
                MultiValueRemove,
                Option,
                ...props.components
            }}
            styles={defaultStyles}
            classNames={defaultClassNames}
            {...props}
        />
    );
}
export default AsyncSelect;