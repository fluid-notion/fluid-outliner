import Chip from "@material-ui/core/Chip/Chip"
import React from "react"
import Octicon from "react-octicon"
import { Avatar } from "@material-ui/core"
import { palette } from "./styles/theme"

interface ISwitchSliderProps {
    label: React.ReactChild
    onToggle: () => void
    isOn: boolean
}

export class SwitchSlider extends React.Component<ISwitchSliderProps> {
    public render() {
        return (
            <Chip
                label={
                    <span style={{ marginLeft: "-3px", marginRight: "-3px" }}>
                        {this.props.label}
                    </span>
                }
                style={{
                    marginTop: "5px",
                    marginRight: "10px",
                    boxShadow: "inset 0 0 5px rgba(0,0,0,0.3)",
                    cursor: "pointer",
                    flexDirection: this.props.isOn ? "row-reverse" : "row",
                }}
                onClick={this.props.onToggle}
                avatar={
                    <Avatar
                        style={{
                            background: palette.primary.light,
                            boxShadow: "0 0 4px rgba(0,0,0,0.5)",
                        }}
                    >
                        <Octicon
                            name="file"
                            style={{
                                fontSize: "1rem",
                                paddingLeft: "0.3rem",
                                lineHeight: "1rem",
                                color: "white",
                            }}
                        />
                    </Avatar>
                }
            />
        )
    }
}
