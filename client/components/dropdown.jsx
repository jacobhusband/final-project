import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

const ellipsisV = <FontAwesomeIcon icon={faEllipsisV} size="xl" />;
const ellipsis = <FontAwesomeIcon icon={faEllipsis} size="xl" />;

const VerticalToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
    className='text-dark'
  >
    {children}
    {ellipsisV}
  </a>
));

const HorizontalToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
    className='text-dark'
  >
    {children}
    {ellipsis}
  </a>
));

VerticalToggle.displayName = 'Vertical Ellipsis dropdown';
HorizontalToggle.displayName = 'Horizontal Ellipsis dropdown';

export default class DropdownCustom extends React.Component {

  render() {
    const options = this.props.options;

    const actions = event => {
      if (this.props.saveRunId) {
        const runId = event.target.closest('.container').getAttribute('runid');
        const postId = event.target.closest('.container').getAttribute('postid');
        this.props.saveRunId(runId);
        this.props.savePostId(postId);
      }
      if (this.props.removePost) {
        const postId = event.target.closest('.container').getAttribute('postid');
        this.props.removePost(postId);
      }
    };

    const items = options.map((option, index) => {
      const { href, text } = option;
      return (
        <Dropdown.Item key={index} href={href} onClick={actions}>{text}</Dropdown.Item>
      );
    });

    const toggle = (this.props.direction === 'horizontal')
      ? HorizontalToggle
      : VerticalToggle;

    return (
      <Dropdown>
        <Dropdown.Toggle as={toggle} />
        <Dropdown.Menu size="sm" title="">
          {items}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
