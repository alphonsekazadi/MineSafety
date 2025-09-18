export default function addAccessibilityAttributesToVisual(visual, accessibilityOptions) {
    if (accessibilityOptions) {
        visual.options.className = accessibilityOptions.className;
        visual.options.role = accessibilityOptions.role;
        visual.options.ariaLabel = accessibilityOptions.ariaLabel;
        visual.options.ariaRoleDescription = accessibilityOptions.ariaRoleDescription;
        visual.options.ariaChecked = accessibilityOptions.ariaChecked;
    }
}
