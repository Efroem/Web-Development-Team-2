using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StarterKit.Migrations
{
    /// <inheritdoc />
    public partial class AddTheatreShowDatesRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_TheatreShowDate_TheatreShowId",
                table: "TheatreShowDate",
                column: "TheatreShowId");

            migrationBuilder.AddForeignKey(
                name: "FK_TheatreShowDate_TheatreShow_TheatreShowId",
                table: "TheatreShowDate",
                column: "TheatreShowId",
                principalTable: "TheatreShow",
                principalColumn: "TheatreShowId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TheatreShowDate_TheatreShow_TheatreShowId",
                table: "TheatreShowDate");

            migrationBuilder.DropIndex(
                name: "IX_TheatreShowDate_TheatreShowId",
                table: "TheatreShowDate");
        }
    }
}
