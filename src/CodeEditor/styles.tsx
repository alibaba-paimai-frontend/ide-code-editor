import styled from 'styled-components';
// import { desaturate } from 'polished';
import { IBaseStyledProps } from 'ide-lib-base-component';
import { ICodeEditorProps } from './index';

interface IStyledProps extends ICodeEditorProps, IBaseStyledProps {}

export const StyledContainer = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})`
  visibility: ${(props: IStyledProps) => (props.visible ? 'visible' : 'hidden')};
  overflow: ${(props: IStyledProps) => (props.visible ? 'visible' : 'hidden')};
  width: ${(props: IStyledProps) => props.visible ? 'auto' : 0}px;
  height: ${(props: IStyledProps) => props.visible ? 'auto' : 0}px;
`;

