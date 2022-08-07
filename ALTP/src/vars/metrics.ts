import { isIphoneX, selectPlatform } from '@/shared/devices'
import { Dimensions } from 'react-native'
import { normalize } from './normalize'

const { width, height } = Dimensions.get('window')

export const metrics = {
  keylines_screen_edge_margin: normalize(10),
  keylines_screen_edge_margin_multi_search: normalize(12),
  keylines_screen_product_info_margin: normalize(12),
  keylines_screen_sign_in_margin: normalize(22),
  keylines_screen_forgot_password_margin: normalize(37),
  keylines_screen_profile_title_margin: normalize(24),

  padding_iphoneX: 20,
  small_base: 5,
  base: 10,
  medium_base: 15,
  double_base: 20,
  triple_base: 30,
  screen_width: width,
  screen_height: height,
  header_absolute_height: selectPlatform({
    iPhoneX: 80,
    android: 80,
    iPad: 70,
    default: 60
  }),
  tab_view_3_height: selectPlatform({
    android: 80,
    ios: 60,
    iPhoneX: 80,
    iPad: 70
  }),
  modal_height: height - 39,
  small_modal_height: 142,
  unit_modal_height: 207,

  // ADataRow
  adata_row_item_container_border_width: 1,
  adata_row_item_container_border_radius: 15,
  adata_row_item_container_padding_horizontal: 12,
  data_row_item_container_padding_vertical: 8,

  // Acontrol
  acontrol_padding_vertical: 12,
  acontrol_border_top_width: 1,
  acontrol_border_bottom_width: 1,

  // Gallery
  gallery_picture_screen_headerIconLeftCustom_width: 18.4,
  gallery_picture_screen_headerIconLeftCustom_height: 18.4,

  gallery_picture_screen_wrapNumberOfImage_padding: 3,
  gallery_picture_screen_wrapNumberOfImage_borderRadius: 3,

  gallery_picture_screen_iconRight_width: 28,
  gallery_picture_screen_iconRight_height: 28,

  gallery_picture_screen_iconRight2_width: 21,
  gallery_picture_screen_iconRight2_height: 21,
  gallery_picture_screen_iconRight2_marginLeft: 36,
  gallery_picture_screen_iconRight2_marginRight: 24,

  gallery_picture_screen_iconRight2_wrapIconRight2_paddingTop: 3,

  gallery_picture_action_container_height: 80,

  gallery_picture_action_wrapImageLeft_marginHorizontal: 12,
  gallery_picture_action_wrapImageLeft_marginBottom: 24,
  gallery_picture_action_wrapImageLeft_marginTop: 15,

  gallery_picture_action_imageLeft_height: 40,
  gallery_picture_action_imageLeft_width: 40,
  gallery_picture_action_imageLeft_marginLeft: 12,

  gallery_picture_action_wrapImageRight_marginBottom: 24,
  gallery_picture_action_wrapImageRight_marginTop: 15,

  gallery_picture_action_imageRight_height: 40,
  gallery_picture_action_imageRight_width: 40,

  // Painting
  painting_screen_strokeColorButton_width: 30,
  painting_screen_strokeColorButton_height: 30,
  painting_screen_strokeColorButton_borderRadius: 15,
  painting_screen_strokeColorButton_marginLeft: 12,

  painting_screen_wrapClose_marginLeft: 27,
  painting_screen_wrapClose_marginTop: 29,

  painting_screen_iconClose_width: 18.4,
  painting_screen_iconClose_height: 18.4,

  painting_screen_wrapText_height: 32,
  painting_screen_wrapText_width: 67,
  painting_screen_wrapText_marginTop: 23,
  painting_screen_wrapText_marginRight: 12,
  painting_screen_wrapText_borderRadius: 3,

  painting_screen_wrapTextsave_height: 32,
  painting_screen_wrapTextsave_width: 67,
  painting_screen_wrapTextsave_marginTop: 23,
  painting_screen_wrapTextsave_marginRight: 12,
  painting_screen_wrapTextsave_borderRadius: 2,

  painting_screen_listColor_height: 79,
  painting_screen_listColor_marginRight: 12,

  // product Info Screen
  product_info_image_height: 280,
  product_info_number_tag_height: 35,
  product_info_number_tag_width: 23,
  product_info_image_icon_request_size: normalize(17),
  product_info_image_icon_like_size: normalize(9),
  product_info_image_icon_camera_size: normalize(22),
  slide_detail_margin: 15,
  slide_detail_padding: 5,
  number_picture_border_radius: normalize(5),
  request_sample_border_radius: normalize(20),
  camera_border_radius: normalize(40),
  product_info_action_icon_button_size: normalize(28),
  product_info_company_icon_size: normalize(18),
  product_info_search_icon_size: normalize(13),

  prod_card_img_size: normalize(80),
  prod_card_content_padding_vertical: 12,
  prod_card_border_radius: normalize(4),
  prod_card_padding_btw_content_and_img: 8,

  prod_card_img_size_multi_search: normalize(48),
  prod_card_content_padding_vertical_multi_search: 12,
  prod_card_border_radius_multi_search: normalize(4),
  prod_card_padding_btw_content_and_img_multi_search: 12,

  prod_card_dot_size: normalize(6),

  // input
  input_height: 40,
  input_icon_size: normalize(13),
  input_padding_horizontal: 12,

  // button
  button_margin_base: 12,

  // icon
  icon_close: normalize(20),

  // camera
  width_for_camera_portrait: normalize(width - 40),
  width_for_camera_landscape: normalize(height / 1.5),

  // camera screen
  camera_footer_height: 120,
  camera_add_contact_footer_height: 80,
  camera_view: width - 30,
  camera_icon: normalize(35),
  image_box: normalize(55),

  // product info
  padding_btw_from_and_button: 62,
  margin_btw_title_and_top: 12,

  // product screen
  product_screen_Toast_container_width: 76,
  product_screen_Toast_container_height: 76,
  product_screen_Toast_container_padding: 4,
  product_screen_Toast_container_borderRadius: 4,
  product_screen_Toast_container_bottom: 22,
  product_screen_Toast_container_right: 16,

  product_screen_Toast_wrapText_top: -105,
  product_screen_Toast_wrapText_right: 10,
  product_screen_Toast_wrapText_width: 20,
  product_screen_Toast_wrapText_height: 20,
  product_screen_Toast_wrapText_borderRadius: 12,

  product_screen_Toast_height: 55,
  product_screen_Toast_width: 68,

  product_screen_Toast_shadowAndroid_elevation: 3,

  // product empty screen
  product_empty_screen_container_padding_horizontal: normalize(30),
  product_empty_screen_wrap_product_margin_bottom: normalize(7),
  product_empty_screen_icon_empty_margin_bottom: normalize(20),
  product_empty_screen_wrap_button_padding_horizontal: normalize(8),
  product_empty_screen_wrap_button_padding_vertical: normalize(6),
  product_empty_screen_wrap_button_border_radius: normalize(4),
  product_empty_screen_icon_camera_width: normalize(30),
  product_empty_screen_icon_camera_height: normalize(23),
  product_empty_screen_wrap_text_click_camera_margin_top: normalize(15),
  product_empty_screen_wrap_text_click_camera_margin_bottom: normalize(12),

  // control
  control_button_size: normalize(40),
  control_button_size_large: normalize(44),
  control_button_icon_size: normalize(24),
  control_margin_btw_title_and_button: 4,

  // Global
  global_info_header_container_padding_bottom: 29,
  global_info_header_container_boder_bottom_width: 12,

  global_info_header_button_add_picture_containerios_top: -105,
  global_info_header_button_add_picture_containerios_left: 0,
  global_info_header_button_add_picture_containerios_right: 0,

  global_info_header_button_add_picture_container_android_height: 210,
  global_info_header_button_add_picture_button_width: 100,
  global_info_header_button_add_picture_button_height: 32,

  global_info_detail_container_padding_bottom: 149,

  global_info_detail_info_form_container_margin_top: 8,
  global_info_detail_info_form_text_container_boder_bottom_with: 1,

  global_info_detail_info_form_text_wrapitem_boder_padding_top: 10,
  global_info_detail_info_form_text_wrapitem_boder_padding_bottom: 6,
  global_info_detail_info_form_text_wrap_value_boder_padding_bottom: 6,

  global_info_header_title_container_padding_top: 21,
  global_info_header_title_wrap_information_margin_top: 16,
  global_info_header_title_wrap_information_padding_bottom: 24,
  global_info_header_title_wrap_icon_height: 16,
  global_info_header_title_wrap_icon_width: 16,
  global_info_header_title_wrap_item_margin_bottom: 8,
  global_info_header_title_border_radius: 4,
  global_info_header_title_icon_height: 10,
  global_info_header_title_icon_width: 10,

  global_info_save_supplier_container_padding_Vertical: 12,
  global_info_save_supplier_container_margin_bottom: 24,
  global_info_save_supplier_wraptextbooth_border_radius: 3,
  global_info_save_supplier_wraptextbooth_padding_horizontal: 4,
  global_info_save_supplier_wraptextbooth_margin_bottom: 4,
  global_info_save_supplier_wrapTextSave_margin_bottom: 14,
  global_info_save_supplier_wrapButtonSave_padding_top: 11,
  global_info_save_supplier_wrapButtonSave_padding_bottom: 9,
  global_info_save_supplier_wrapButtonSave_boder_radius: 2,
  global_info_save_supplier_wrapButtonSave_margin_bottom: 24,

  // supplier
  supplier_card_img_size: normalize(64),
  supplier_card_padding_btw_content_and_img: 12,
  supplier_card_dot_size: normalize(5),
  supplier_card_img_size_multi_search: normalize(48),

  // supplier info

  supplier_margin_with_cover: 63,
  supplier_info_header_wrap_title_margin_bottom: 12,
  supplier_info_header_container_padding_horizontal: 9,
  supplier_info_header_container_border_bottom_width: 0.5,
  supplier_border_radius: normalize(5),

  // Home
  home_screen_header_height: 93,
  home_screen_header_margin_top_appname: 52,
  home_screen_header_margin_top_icon: 58,
  home_screen_header_margin_right_icon: 24,
  home_screen_header_margin_bottom: 8,
  home_screen_header_height_icon: 107,
  home_screen_header_width_icon: 85,
  home_screen_header_width_logo_until_right_screen: 130,

  home_screen_products_contentstyle_padding_horizontal: 8,
  home_screen_products_title_container_margin_bottom: 14,
  home_screen_products_title_container_margin_top: 12,
  home_screen_products_item_padding_bottom: 16,
  home_screen_products_item_margin_horizontal: 4,
  home_screen_product_card_border_radius: 4,
  home_screen_product_card_name_product_margin_top: 2,
  home_screen_products_title_header_padding_left: 12,
  home_screen_products_title_header_padding_right: 8,
  home_screen_products_cross_border_bottom_width: 1,

  home_screen_suppliers_title_container_margin_bottom: 13,
  home_screen_suppliers_title_container_margin_top: 12,
  home_screen_suppliers_padding_bottom: 152,
  home_screen_suppliers_country_margin_vertical: 4,
  home_screen_suppliers_categories_margin_bottom: 5,
  home_screen_suppliers_wrap_image_margin_right: 4,
  home_screen_suppliers_wrap_image_detail_border_radius: 2,
  home_screen_suppliers_wrap_image_margin_left: 88,
  home_screen_suppliers_list_card_item_border_bottom_width: 1,
  home_screen_suppliers_wrap_type_suppliers_height: 18,
  home_screen_suppliers_wrap_type_suppliers_margin_bottom: 5,
  home_screen_suppliers_title_header_padding_left: 12,
  home_screen_suppliers_title_header_padding_right: 8,
  home_screen_suppliers_list_border_bottom_width: 1,
  home_screen_suppliers_list_card_list_image_detail_border_bottom_width: 1,

  home_screen_form_button_padding_horizontal: 16,
  home_screen_form_button_padding_vertical: 12,
  home_screen_form_button_margin_top: 1,
  home_screen_form_button_view_all_margin_right: 10,
  home_screen_form_button_left_margin: 0,
  home_screen_form_button_left_border_radius: 2,
  home_screen_form_button_right_margin: 0,
  home_screen_form_button_right_border_radius: 2,
  home_screen_form_button_text_font_weight: '600',
  home_screen_form_button_text_margin_top: 9,
  home_screen_form_button_text_margin_bottom: 7,

  home_screen_margin_edge: 12,
  home_footer_button_width: 25,
  home_footer_camera_size: normalize(64),
  home_screen_image_size: normalize(65),
  home_screen_image_detail_size: normalize(40),
  home_footer_camera_height: normalize(27),
  home_footer_camera_width: normalize(35.6),
  home_footer_button_size: normalize(24),
  home_latest_product_image_size: normalize(102),

  // home_event_wrap_logo_size: 103,
  // home_event_logo_size: 80,
  // home_event_content_height: 104,
  home_event_edge_margin: 12,
  home_event_edge_margin_2: 17,
  home_event_edge_margin_3: 24,

  home_event_logo: normalize(64),
  home_event_button_height: normalize(40),

  // AFrom
  afrom_title_container_border_bottom_width: 0.7,
  afrom_container_border_radius: 4,
  afrom_contentstyle_border_bottom_width: 0,
  afrom_contentstyle_padding_horizontal: 2,

  // Modal
  modal_header_icon: normalize(16),

  // AThumbnail
  thumbnail_image_height: 22,
  thumbnail_image_width: 22,

  // Select category
  icon_category_size: normalize(29),

  // ABooth
  booth_margin_width_text: 8,

  // Select unit button height
  select_unit_button_height: normalize(52),

  // modal
  modal_header_padding_around: 12,
  modal_header_icon_size: normalize(20),
  modal_header_padding_btw_icon: normalize(22),
  modal_small_height: 300,
  modal_small_content_height: 218,

  // linear gradient button
  button_gradient_height: normalize(42),
  button_gradient_width: normalize(295),
  button_gradient_border: normalize(20),

  // profile screen
  profile_header_height: isIphoneX() ? 245 : 225,
  profile_logo_name_size: normalize(112),
  profile_margin_top: 16,
  profile_sync_status_margin_top: 28,
  profile_wifi_size: normalize(34),
  profile_team_member_item_height: 53,

  // AViewIpad
  screen_width_for_ipad: normalize(450),
  padding_top_for_ipad: 100,

  // forgotPasswordScreen
  icon_message_width: normalize(119),
  icon_message_height: normalize(85),

  // SelectTeam
  row_height: normalize(30),
  icon_team: normalize(13),
  separator_margin: 60,
  button_height: normalize(40),
  button_margin_bottom: 5,

  // Create Team
  margin_btw_button_text_input: 25,

  // AInputOne
  container_height: normalize(69),
  wrap_text_input_height: normalize(42),
  wrap_text_input_border_radius: normalize(5),

  // AHeaderOne
  header_one_icon_width: normalize(24),
  header_one_icon_height: normalize(26),

  // AHeader
  aheader_title_fontsize: 17,
  aheader_icon_height: 20,
  aheader_icon_width: 20,
  aheader_backButtonIOSText_fontSize: 17,
  aheader_backButtonIOSText_height: 22,
  aheader_backButtonIOSText_width: 22,

  // ADoubleButton
  double_button_height: 45,
  double_button_line_height: 60 - 28,
  double_button_icon_size: 16,

  // Camera
  business_card_grid_height: 220,

  // modal3
  multi_select_text_input: 50,

  // ATabView
  tab_view_height: normalize(45),
  tab_view_margin: 16,

  // Thumbnail2
  thumbnail_size: 64,

  // eventDetectedContent
  event_detected_icon_size: normalize(24),
  event_detected_bottom_height: 120,
  event_detected_button_height: 36,

  // menu side
  arrow_icon_size: 16,

  // button2
  padding_horizontal: 14,
  icon_size: 20,

  // setting screen
  setting_screen_margin_top: 44,

  // profile screen
  profile_screen_margin_top: 41,

  // project screen
  project_list_padding_bottom: 20,
  project_list_item_icon_size: 16,
  project_list_item_title_padding_horizontal: 13,

  // Tasks
  tasks_row_height: 57,
  tasks_check_icon_size: 24,
  tasks_product_image_size: 33,

  // Samplse
  sample_row_height: 65,
  sample_row_icon_size: 48,

  // Icon Action Button
  icon_action_button_container_width: 72,
  icon_action_button_container_height: 67,
  icon_action_button_gradient_icon_width: normalize(40),
  icon_action_button_gradient_icon_height: normalize(40),
  icon_action_button_gradient_icon_border_radius: 20,
  icon_action_button_gradient_icon_margin_bottom: 4,
  icon_action_button_icon_width: normalize(22),
  icon_action_button_icon_height: normalize(22),

  // Footer Task
  footer_task_container_height: 108,
  footer_task_action_margin_top: 12,
  footer_task_icon_marginLeft: normalize(12),
  footer_task_cancel_width: normalize(51),
  footer_task_cancel_height: normalize(51),
  footer_task_cancel_margin_right: normalize(21),
  footer_task_cancel_border_radius: 8,
  footer_task_cancel_padding: 18,
  footer_task_cancel_icon_width: normalize(16),
  footer_task_cancel_icon_height: normalize(16),
  footer_task_product_selected_container_margin_top: 6,

  // Event Info
  event_info_wrap_close_icon_size: normalize(44),
  event_info_close_icon_size: normalize(24),
  event_info_checked_icon_size: normalize(16),
  event_info_logo_size: normalize(84),
  event_info_header_action_margin_top: normalize(30),
  event_info_header_action_button_height: normalize(40),
  event_info_header_action_button_border_radius: normalize(5),
  event_info_header_absolute_height: selectPlatform({
    iPad: 90,
    default: 90
  }),

  // Exhibitor modal
  exhibitor_modal_height: normalize(372),
  exhibitor_modal_width: '97%',
  exhibitor_modal_button_height: normalize(40),
  exhibitor_modal_button_width: '48%',
  exhibitor_modal_logo_size: normalize(128),
  exhibitor_modal_description_text_margin: normalize(7),

  // Check in event modal
  check_in_event_modal_height: normalize(385),
  check_in_event_modal_width: '99%',
  check_in_event_modal_header_height: normalize(78),
  check_in_event_modal_icon_size: normalize(24),
  check_in_event_modal_item_margin_bottom: normalize(26),

  // Empty project screen
  empty_project_header_image_size: normalize(128),
  empty_project_header_image_margin_top: normalize(57),
  empty_project_button_title_margin_top: normalize(21),
  empty_project_button_height: normalize(40),
  empty_project_button_width: '40%',
  empty_project_button_margin_top: normalize(24),
  empty_project_instruction_margin_top: normalize(48),
  empty_project_instruction_title_margin_Bottom: normalize(32),
  empty_project_instruction_margin_horizontal: normalize(26),
  empty_project_instruction_wrap_icon_size: normalize(60),
  empty_project_instruction_icon_size: normalize(32),

  // Contact screen
  contact_image_cover_height: normalize(205),
  contact_image_cover_width: normalize(374),

  // Download screen
  download_alert_height: normalize(104),
  download_alert_width: normalize(width - 48),
  download_alert_margin_top: normalize(36),
  download_alert_icon_size: normalize(40),
  download_description_text_margin_bottom: normalize(48),
  download_slider_height: normalize(18)
}
