import Select from "antd/lib/select";
import { map } from "lodash";
import DynamicComponent, { registerComponent } from "@/components/DynamicComponent";
import PropTypes from "prop-types";
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import StarFilledIcon from "@ant-design/icons/StarFilled";
import cx from "classnames";

import "./QuerySourceDropdownItem"; // register QuerySourceDropdownItem

export function QuerySourceDropdown({ dataSources, value = [], disabled, loading, onChange }) {
  const handleDragEnd = result => {
    if (!result.destination) return;
    const items = Array.from(value);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    onChange(items);
  };

  const tagRender = tagProps => {
    const { label, value: val, closable, onClose } = tagProps;
    const index = value.indexOf(val);
    return (
      <Draggable draggableId={String(val)} index={index} key={val}>
        {provided => (
          <span
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={cx("ant-select-selection-item", { "primary-tag": index === 0 })}
          >
            {index === 0 && <StarFilledIcon className="m-r-5" />}
            {label}
            {closable && (
              <span className="ant-select-selection-item-remove" onClick={onClose} />
            )}
          </span>
        )}
      </Draggable>
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="ds" direction="horizontal">
        {provided => (
          <Select
            mode="multiple"
            className="w-100"
            data-test="SelectDataSource"
            placeholder="Choose data source..."
            value={value}
            disabled={disabled}
            loading={loading}
            optionFilterProp="data-name"
            showSearch
            tagRender={tagRender}
            onChange={onChange}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {map(dataSources, ds => (
              <Select.Option key={`ds-${ds.id}`} value={ds.id} data-name={ds.name} data-test={`SelectDataSource${ds.id}`}>
                <DynamicComponent name={"QuerySourceDropdownItem"} dataSource={ds} />
              </Select.Option>
            ))}
          </Select>
        )}
      </Droppable>
    </DragDropContext>
  );
}

QuerySourceDropdown.propTypes = {
  dataSources: PropTypes.any,
  value: PropTypes.arrayOf(PropTypes.number),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
};

registerComponent("QuerySourceDropdown", QuerySourceDropdown);
