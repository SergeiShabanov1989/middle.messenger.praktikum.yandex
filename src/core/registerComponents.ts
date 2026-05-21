import { registerComponent } from "./registerComponent";
import Button from "../components/button/Button";
import Input from "../components/input/Input";
import Field from "../components/field/Field";
import BackButton from "../components/back-button/BackButton";
import ChatItem from "../components/chat-item/ChatItem";
import ChatList from "../components/chat-list/ChatList";
import ChatSearch from "../components/chat-search/ChatSearch";
import ChatSidebar from "../components/chat-sidebar/ChatSidebar";
import ChatWindow from "../components/chat-window/ChatWindow";
import Message from "../components/message/Message";
import ProfileAvatar from "../components/profile-avatar/ProfileAvatar";
import ProfileField from "../components/profile-field/ProfileField";
import ErrorMessage from "../components/error-message/ErrorMessage";

let registered = false;

export function registerAllComponents(): void {
  if (registered) return;
  registered = true;

  registerComponent(Button);
  registerComponent(Input);
  registerComponent(Field);
  registerComponent(BackButton);
  registerComponent(ChatItem);
  registerComponent(ChatList);
  registerComponent(ChatSearch);
  registerComponent(ChatSidebar);
  registerComponent(ChatWindow);
  registerComponent(Message);
  registerComponent(ProfileAvatar);
  registerComponent(ProfileField);
  registerComponent(ErrorMessage);
}
