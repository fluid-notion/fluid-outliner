import { XYCoord } from "dnd-core";
import {
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DropTarget,
} from "react-dnd";
import { findDOMNode } from "react-dom";
import { INodeEditorInnerProps } from "../components/NodeEditor";

export interface IDragItem {
  id: string;
  index: number;
}

export interface IDragSourceProps {
  connectDragSource: ConnectDragSource;
  isDragging: () => boolean;
}

export interface IDropTargetProps {
  connectDropTarget: ConnectDropTarget;
  isOver: () => boolean;
}

export const NodeDragSource = DragSource<INodeEditorInnerProps>(
  "Node",
  {
    beginDrag: props => ({ id: props.node.id, index: props.index }),
    isDragging: (props, monitor) =>
      !!(
        monitor &&
        ((monitor.getItem() as any) as IDragItem).id === props.node.id
      ),
    endDrag: (props, monitor) => {
      if (!monitor || !monitor.didDrop()) {
        props.completeDrop(null);
      }
    }
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
);

export const NodeDropTarget = DropTarget<INodeEditorInnerProps>(
  "Node",
  {
    hover(props, monitor, component) {
      if (!monitor) return;
      if (!component) return;
      const draggedItem: IDragItem = monitor.getItem() as any;
      const dragIndex = draggedItem.index;
      const hoverIndex = props.index;
      const targetId = props.node.id;
      const sourceId = draggedItem.id;
      if (targetId === sourceId) return;
      if (props.node.hasDescendent(sourceId)) return;

      // Determine rectangle on screen
      const hoverBoundingRect = (findDOMNode(
        component
      ) as Element).getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex) {
        if (hoverClientY < hoverMiddleY) return;
        props.setPotentialDropTarget({ id: targetId, location: "above" });
      }

      // Dragging upwards
      if (dragIndex > hoverIndex) {
        if (hoverClientY > hoverMiddleY) return;
        props.setPotentialDropTarget({ id: targetId, location: "below" });
      }
    },
    drop(props, monitor) {
      if (!monitor) return;
      const item: IDragItem = monitor.getItem() as any;
      if (!item) return;
      props.completeDrop(item.id);
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  })
);
